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
  const ticket = data;

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
    printer.style("B");
    printer.text(ticket.company);
    printer.style("NORMAL");
    line();

    printer.text("");
    printer.size(0, 0);
    printer.style("B");
    printer.text(`${ticket.route.from}  ->  ${ticket.route.to}`);
    printer.text("");

    printer.size(1, 1);
    printer.text("Veh NO: " + ticket.vehicleNumber);

    const seats = ticket.seats;
    for (let i = 0; i < seats.length; i += 4) {
      printer.text(
        `${i == 0 ? "Seat NO: " : ""}` + seats.slice(i, i + 4).join(",")
      );
    }
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
    printer.text(lineLR("Quantity:", ticket.seats.length + " X"));
    printer.style("b");
    printer.text(lineLR("Total Payable:", ticket.fare.total));
    printer.style("normal");

    // note

    // ---------- NOTES ----------
    printer.text("");
    printer.size(0, 0);
    printer.align("CT");
    printer.style("NORMAL");

    const noteText =
      "Note: Passengers are responsible for their own luggage. The company is not liable for any loss or damage.";

    wrapText(noteText).forEach((line) => {
      printer.text(lineLR(line, ""));
    });

    // Number
    printer.text("");
    printer.text(lineLR("Booking: 0301-1234567", "Helpline: 042-12345678"));
    printer.style("NORMAL");

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
