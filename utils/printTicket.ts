import { BookingTicket, Vehicle, Voucher } from "../types/booking";
import { formatDate, formatTime } from "./dateUtils";
import { toast } from "./toast";

export async function printTicket(
  ticket: BookingTicket,
  vehicle: Vehicle,
  voucher: Voucher,
  terminalName: string,
  terminalPhone?: string
): Promise<boolean> {
  try {
    // Format seat numbers as strings
    const seats = ticket.seatIds.map((id) => id.toString());

    // Format departure date and time
    const departureDate = formatDate(new Date(voucher.date));
    const departureTime = formatTime(voucher.departureTime);
    const departure = `${departureDate} | ${departureTime}`;

    // Format ticket data for printer
    const printData = {
      bookingId: ticket.id.substring(0, 10).toUpperCase(),
      seats,
      company: terminalName,
      terminalPhone: terminalPhone || undefined,
      route: {
        from: voucher.origin.toUpperCase(),
        to: ticket.destination.toUpperCase(),
      },
      departure,
      vehicleNumber: vehicle.registrationNumber,
      passenger: {
        name: ticket.passenger.name || undefined,
        phone: ticket.passenger.phone || undefined,
        cnic: ticket.passenger.cnic || undefined,
        gender: ticket.passenger.gender
          ? ticket.passenger.gender === "male"
            ? "Male"
            : "Female"
          : undefined,
      },
      fare: {
        price: `${ticket.totalBaseFare} PKR`,
        discount: `${ticket.totalDiscount} PKR`,
        total: `${ticket.finalTotal} PKR`,
      },
    };

    // Call Electron IPC to print
    const result = await (window as any).customAPI.printReceipt(printData);

    if (result.success) {
      toast.success("Ticket printed successfully");
      return true;
    } else {
      toast.error(`Print failed: ${result.error || "Unknown error"}`);
      return false;
    }
  } catch (error) {
    console.error("Print ticket error:", error);
    toast.error("Failed to print ticket. Please check printer connection.");
    return false;
  }
}
