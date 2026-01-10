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
// Prints TWO receipts: Main passenger ticket + Small stub for driver assistant
function printTicket(data) {
  return new Promise((resolve, reject) => {
    if (!data) {
      return reject(new Error("No ticket data provided"));
    }

    const ticket = data;

    try {
      const device = new escpos.USB(); // auto-detect printer
      const printer = new escpos.Printer(device);

      const line = () => {
        printer.size(0, 0);
        printer.align("CT");
        printer.text("".padEnd(42, "-"));
      };

      device.open((error) => {
        if (error) {
          return reject(new Error(`Failed to open printer: ${error.message}`));
        }

        try {
          // ========== PRINT 1: MAIN PASSENGER TICKET ==========
          line();
          printer.size(0, 0);
          printer.style("B");
          printer.text("Mian Travels");
          printer.style("NORMAL");
          printer.text(ticket.company);
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

          // Only print passenger fields if they exist
          if (ticket.passenger.name) {
            printer.text(lineLR("Name:", ticket.passenger.name));
          }
          if (ticket.passenger.phone) {
            printer.text(lineLR("Phone No:", ticket.passenger.phone));
          }
          if (ticket.passenger.cnic) {
            printer.text(lineLR("CNIC No:", ticket.passenger.cnic));
          }
          if (ticket.passenger.gender) {
            printer.text(lineLR("Gender:", ticket.passenger.gender));
          }
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
          if (ticket.terminalPhone) {
            printer.text(lineLR("", `Booking No: ${ticket.terminalPhone}`));
          }
          printer.style("NORMAL");

          // // Feed & cut for main ticket
          printer.feed(2);
          printer.cut("partial");

          // ========== PRINT 2: SMALL STUB FOR DRIVER ASSISTANT ==========
          printer.feed(1);
          printer.size(0, 0);
          printer.align("CT");
          printer.style("NORMAL");

          // Vehicle and seats
          printer.text("Veh: " + ticket.vehicleNumber);
          for (let i = 0; i < ticket.seats.length; i += 6) {
            printer.text("Seat: " + ticket.seats.slice(i, i + 6).join(","));
          }
          printer.text("");

          // Route
          printer.text(ticket.route.from + " -> " + ticket.route.to);
          printer.text("");

          // Date time
          printer.text(ticket.departure);
          printer.text("");

          // Total
          printer.text("Total: " + ticket.fare.total);
          printer.text("");

          // Feed & cut for stub
          printer.feed(3);
          printer.cut("partial");
          printer.close();
          resolve();
        } catch (printError) {
          reject(new Error(`Print operation failed: ${printError.message}`));
        }
      });
    } catch (error) {
      reject(new Error(`Printer initialization failed: ${error.message}`));
    }
  });
}

// ---------- VOUCHER PRINT FUNCTION ----------
function printVoucher(data) {
  return new Promise((resolve, reject) => {
    if (!data) {
      return reject(new Error("No voucher data provided"));
    }

    const voucher = data;

    try {
      const device = new escpos.USB();
      const printer = new escpos.Printer(device);

      const line = () => {
        printer.size(0, 0);
        printer.align("CT");
        printer.text("".padEnd(42, "-"));
      };

      device.open((error) => {
        if (error) {
          return reject(new Error(`Failed to open printer: ${error.message}`));
        }

        try {
          line();
          printer.size(0, 0);
          printer.style("B");
          printer.text("Mian Travels");
          printer.style("NORMAL");
          printer.text(ticket.company);
          line();

          printer.text("");
          printer.size(0, 0);
          printer.text(`From: ${voucher.route.from}`);
          printer.size(1, 1);
          printer.text(`Veh: ${voucher.vehicleNumber}`);
          printer.size(0, 0);
          printer.text("");
          printer.text(`${voucher.departure}`);
          printer.text("");

          // Driver info
          printer.text(`Driver: ${voucher.driver.name}`);
          printer.text(`Mobile: ${voucher.driver.mobile}`);

          line();
          printer.style("B");
          printer.text("REVENUE BREAKDOWN");
          printer.style("NORMAL");
          line();

          // Revenue table
          voucher.revenueByDestination.forEach((item) => {
            printer.text(lineLR(item.destination, `${item.tickets} tkt`));
            printer.text(lineLR("", item.revenue));
          });

          line();
          printer.text(
            lineLR("Total Bookings:", `${voucher.totalSeats} seats`)
          );
          line();

          // Financial summary
          printer.text("");
          printer.style("B");
          printer.text("FINANCIAL SUMMARY");
          printer.style("NORMAL");
          printer.text("");
          printer.text(lineLR("Total Fare:", voucher.summary.totalFare));
          printer.text(lineLR("Terminal Tax:", voucher.summary.terminalTax));
          printer.text(lineLR("Cargo:", voucher.summary.cargo));
          line();
          printer.style("B");
          printer.size(1, 1);
          printer.text(lineLR("Grand Total:", voucher.summary.grandTotal));
          printer.style("NORMAL");
          printer.size(0, 0);
          line();

          // Feed & cut
          printer.feed(4);
          printer.cut("partial");
          printer.close();
          resolve();
        } catch (printError) {
          reject(new Error(`Print operation failed: ${printError.message}`));
        }
      });
    } catch (error) {
      reject(new Error(`Printer initialization failed: ${error.message}`));
    }
  });
}

// Export
module.exports = {
  printTicket,
  printVoucher,
};
