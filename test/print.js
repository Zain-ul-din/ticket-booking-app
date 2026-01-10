const printService = require("../electron/services/printer.js");

printService.printTicket({
  bookingId: "BK-459812",
  seats: ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
  company: "Nadar Flying Coach",
  route: { from: "LAHORE", to: "ISLAMABAD" },
  departure: "10 Jan 2026 | 09:30 AM",
  vehicleNumber: "ABC-1234",
  passenger: {
    name: "Ali Khan",
    phone: "0301-1234567",
    cnic: "35202-123XXXX-1",
    gender: "Male",
  },
  fare: {
    price: "1500 PKR",
    discount: "-200 PKR",
    total: "1300 PKR",
  },
});
