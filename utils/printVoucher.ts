import { Voucher, Vehicle, VoucherFinancialSummary } from '../types/booking';
import { formatDate, formatTime } from './dateUtils';
import { toast } from './toast';

export async function printVoucherSummary(
  voucher: Voucher,
  vehicle: Vehicle,
  summary: VoucherFinancialSummary,
  terminalName: string
): Promise<boolean> {
  try {
    // Format departure date and time
    const departureDate = formatDate(new Date(voucher.date));
    const departureTime = formatTime(voucher.departureTime);
    const departure = `${departureDate} | ${departureTime}`;

    // Format voucher data for printer
    const printData = {
      company: terminalName,
      vehicleNumber: vehicle.registrationNumber,
      route: {
        from: voucher.origin.toUpperCase(),
      },
      departure,
      driver: {
        name: voucher.driverName,
        mobile: voucher.driverMobile,
      },
      revenueByDestination: summary.revenueByDestination.map(item => ({
        destination: item.destination,
        tickets: item.ticketCount,
        revenue: `${item.totalRevenue} PKR`,
      })),
      summary: {
        totalFare: `${summary.totalFare} PKR`,
        terminalTax: `${summary.terminalTax} PKR`,
        cargo: `${summary.cargo} PKR`,
        grandTotal: `${summary.grandTotal} PKR`,
      },
      totalSeats: voucher.bookedSeats.length,
    };

    // Call Electron IPC to print voucher
    const result = await window.customAPI.printVoucher(printData);

    if (result.success) {
      toast.success('Voucher printed successfully');
      return true;
    } else {
      toast.error(`Print failed: ${result.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.error('Print voucher error:', error);
    toast.error('Failed to print voucher. Please check printer connection.');
    return false;
  }
}
