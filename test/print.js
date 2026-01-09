const printService = require("../services/printer.js");

printService.printTicket({
  company: "MIAN TRAVELS",
  route: { from: "LAHORE", to: "ISLAMABAD" },
  departure: "10 Jan 2026 | 09:30 AM",
  vehicleNumber: "ABC-1234",
  seatNumber: "12A",
  passenger: {
    name: "Ali Khan",
    phone: "0301-1234567",
    cnic: "35202-1234567-1",
    gender: "Male",
  },
  fare: {
    price: "1500 PKR",
    discount: "-200 PKR",
    total: "1300 PKR",
  },
});
