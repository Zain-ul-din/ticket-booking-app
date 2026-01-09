// ticketService.js
const escpos = require("escpos");
escpos.USB = require("escpos-usb");

// ---------- CONFIG ----------
const WIDTH = 42; // 80mm printer typical chars per line

// ---------- HELPERS ----------

// Truly center text with equal padding
function center(text) {
  const totalSpace = WIDTH - text.length;
  const leftSpace = Math.floor(totalSpace / 2);
  const rightSpace = totalSpace - leftSpace;
  return (
    " ".repeat(Math.max(leftSpace, 0)) +
    text +
    " ".repeat(Math.max(rightSpace, 0))
  );
}

// Left-right alignment
function lineLR(left, right) {
  const space = WIDTH - left.length - right.length;
  return left + " ".repeat(Math.max(space, 1)) + right;
}

// Wrap long text safely
function wrapText(text) {
  const words = text.split(" ");
  let line = "";
  const lines = [];

  for (const word of words) {
    if ((line + word).length <= WIDTH) {
      line += (line ? " " : "") + word;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Divider line
function divider() {
  return "-".repeat(WIDTH);
}

// ---------- TICKET PRINT FUNCTION ----------
function printTicket(data = null) {
  const initialData = {
    company: "MIAN TRAVELS",
    route: { from: "LAHORE", to: "ISLAMABAD" },
    departure: "10 Jan 2026 | 09:30 AM",
    vehicleNumber: "ABC-1234",
    seatNumber: "12A",
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
  };

  // Use dummy data if none provided
  const ticket = data ? { ...data, ...initialData } : initialData;

  const device = new escpos.USB(); // auto-detect printer
  const printer = new escpos.Printer(device);

  const line = () => {
    printer.size(0, 0);
    printer.align("CT");
    printer.text("".padEnd(42, "-"));
  };

  device.open(() => {
    line();
    printer.size(0, 0);
    printer.text(ticket.company);
    line();

    printer.text("");
    printer.size(0, 0);
    printer.style("B");
    printer.text(`${ticket.route.from}  ->  ${ticket.route.to}`);
    printer.text("");

    printer.size(1, 1);
    printer.text("Veh NO: " + ticket.vehicleNumber);
    printer.text("Seat NO: " + ticket.seatNumber);
    printer.style("NORMAL");

    printer.size(0, 0);
    printer.text("");
    printer.text(`${ticket.departure}`);

    line();
    printer.size(0, 0);
    printer.align("CT");
    printer.style("B");
    printer.text(lineLR("Passenger Information", ""));
    printer.style("normal");
    printer.text(lineLR("Name:", ticket.passenger.name));
    printer.text(lineLR("Phone No:", ticket.passenger.phone));
    printer.text(lineLR("CNIC No:", ticket.passenger.cnic));
    printer.text(lineLR("Gender:", ticket.passenger.gender));
    line();

    printer.text(lineLR("Fare:", ticket.fare.price));
    printer.text(lineLR("Discount:", ticket.fare.discount));
    printer.style("b");
    printer.text(lineLR("Total Payable:", ticket.fare.total));
    printer.style("normal");

    // // 🏢 Company Name - big + centered
    // printer.style("b"); // bold
    // bigCompanyName(ticket.company).forEach((line) => printer.text(line));
    // printer.style("normal");
    // printer.text(divider());

    // // 🚌 Route
    // printer.style("b");
    // printer.text(center(`${ticket.route.from}  →  ${ticket.route.to}`));
    // printer.style("normal");

    // // ⏰ Departure

    // // 🚐 Vehicle Number & Seat Number
    // printer.text(
    //   center(`Vehicle No: ${ticket.vehicleNumber} | Seat: ${ticket.seatNumber}`)
    // );
    // printer.text(divider());

    // // 👤 Passenger Info
    // printer.text("Passenger Details");
    // printer.text(divider());
    // printer.text(lineLR("Name:", ticket.passenger.name));
    // printer.text(lineLR("Phone:", ticket.passenger.phone));
    // printer.text(lineLR("CNIC:", ticket.passenger.cnic));
    // printer.text(lineLR("Gender:", ticket.passenger.gender));
    // printer.text(divider());

    // // 💰 Fare

    // // Feed & cut
    printer.feed(4);
    printer.cut("partial");
    printer.close();
  });
}

// Export
module.exports = {
  printTicket,
};
