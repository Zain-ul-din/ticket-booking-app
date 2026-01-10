interface PrintTicketData {
  bookingId: string;
  seats: string[];
  company: string;
  terminalPhone?: string;
  route: { from: string; to: string };
  departure: string;
  vehicleNumber: string;
  passenger: {
    name?: string;
    phone?: string;
    cnic?: string;
    gender?: string;
  };
  fare: {
    price: string;
    discount: string;
    total: string;
  };
}

interface PrintVoucherData {
  company: string;
  vehicleNumber: string;
  route: { from: string };
  departure: string;
  driver: {
    name: string;
    mobile: string;
  };
  revenueByDestination: Array<{
    destination: string;
    tickets: number;
    revenue: string;
  }>;
  summary: {
    totalFare: string;
    terminalTax: string;
    cargo: string;
    grandTotal: string;
  };
  totalSeats: number;
}

interface CustomAPI {
  getPrinters: () => Promise<any[]>;
  printReceipt: (data: PrintTicketData) => Promise<{ success: boolean; error?: string }>;
  printVoucher: (data: PrintVoucherData) => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    customAPI: CustomAPI;
  }
}
