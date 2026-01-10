import { BookingTicket, BookedSeat } from '../types/booking';

/**
 * Derive BookedSeat array from tickets for backward compatibility
 * Distributes total discount proportionally across seats
 */
export function deriveBookedSeatsFromTickets(tickets: BookingTicket[]): BookedSeat[] {
  const bookedSeats: BookedSeat[] = [];

  tickets.forEach(ticket => {
    const discountPerSeat = ticket.totalDiscount / ticket.seatIds.length;

    ticket.seatIds.forEach(seatId => {
      bookedSeats.push({
        seatId,
        passenger: ticket.passenger,
        destination: ticket.destination,
        fare: ticket.baseFarePerSeat,
        discount: discountPerSeat,
        finalFare: ticket.baseFarePerSeat - discountPerSeat
      });
    });
  });

  return bookedSeats;
}

/**
 * Migrate old bookedSeats to ticket format
 * Groups seats by passenger CNIC + destination to reconstruct original bookings
 */
export function migrateBookedSeatsToTickets(
  bookedSeats: BookedSeat[],
  voucherId: string
): BookingTicket[] {
  // Group by passenger CNIC + destination (assumes same passenger + same dest = same booking)
  const groupKey = (seat: BookedSeat) =>
    `${seat.passenger.cnic}|${seat.destination}`;

  const grouped = bookedSeats.reduce((acc, seat) => {
    const key = groupKey(seat);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(seat);
    return acc;
  }, {} as Record<string, BookedSeat[]>);

  // Create tickets from groups
  return Object.values(grouped).map(group => {
    const totalBaseFare = group.reduce((sum, s) => sum + s.fare, 0);
    const totalDiscount = group.reduce((sum, s) => sum + s.discount, 0);

    return {
      id: crypto.randomUUID(),
      voucherId,
      seatIds: group.map(s => s.seatId).sort((a, b) => a - b),
      passenger: group[0].passenger,
      destination: group[0].destination,
      baseFarePerSeat: group[0].fare,
      totalBaseFare,
      totalDiscount,
      finalTotal: totalBaseFare - totalDiscount,
      createdAt: new Date().toISOString()
    };
  });
}

/**
 * Find ticket containing a specific seat
 */
export function findTicketBySeatId(
  tickets: BookingTicket[],
  seatId: number
): BookingTicket | undefined {
  return tickets.find(t => t.seatIds.includes(seatId));
}

/**
 * Validate ticket data
 * Returns array of error messages (empty if valid)
 */
export function validateTicket(ticket: Partial<BookingTicket>): string[] {
  const errors: string[] = [];

  if (!ticket.passenger?.name?.trim()) {
    errors.push('Passenger name is required');
  }

  if (!ticket.passenger?.cnic?.match(/^\d{5}-\d{7}-\d$/)) {
    errors.push('Invalid CNIC format (XXXXX-XXXXXXX-X)');
  }

  if (!ticket.destination?.trim()) {
    errors.push('Destination is required');
  }

  if (!ticket.seatIds || ticket.seatIds.length === 0) {
    errors.push('At least one seat must be selected');
  }

  if (ticket.totalDiscount !== undefined && ticket.totalBaseFare !== undefined) {
    if (ticket.totalDiscount > ticket.totalBaseFare) {
      errors.push('Discount cannot exceed total fare');
    }
    if (ticket.totalDiscount < 0) {
      errors.push('Discount cannot be negative');
    }
  }

  return errors;
}

/**
 * Calculate ticket summary (useful for fare displays)
 */
export function calculateTicketSummary(
  baseFarePerSeat: number,
  seatCount: number,
  totalDiscount: number
) {
  const totalBaseFare = baseFarePerSeat * seatCount;
  const finalTotal = Math.max(0, totalBaseFare - totalDiscount);
  const discountPerSeat = totalDiscount / seatCount;

  return {
    totalBaseFare,
    finalTotal,
    discountPerSeat
  };
}
