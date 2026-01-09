import { Seat, BookedSeat } from '../types/booking';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { User } from 'lucide-react';

interface SeatMapProps {
  seats: Seat[];
  bookedSeats?: BookedSeat[];
  onSeatClick?: (seat: Seat) => void;
  readOnly?: boolean;
  compact?: boolean;
}

export function SeatMap({
  seats,
  bookedSeats = [],
  readOnly = false,
  compact = false,
  onSeatClick,
}: SeatMapProps) {
  // Get grid dimensions from seats
  const maxRow = seats.length > 0 ? Math.max(...seats.map(s => s.row)) : 0;
  const maxCol = seats.length > 0 ? Math.max(...seats.map(s => s.col)) : 0;

  // Create a 2D grid
  const grid: (Seat | null)[][] = Array(maxRow + 1)
    .fill(null)
    .map(() => Array(maxCol + 1).fill(null));

  // Fill the grid with seats
  seats.forEach(seat => {
    grid[seat.row][seat.col] = seat;
  });

  // Check if seat is booked
  const getSeatBooking = (seatId: number) => {
    return bookedSeats.find(bs => bs.seatId === seatId);
  };

  const getSeatClass = (seat: Seat, booking?: BookedSeat) => {
    const baseClass = compact ? 'w-8 h-8 text-xs' : 'w-12 h-12 text-sm';
    const isBooked = !!booking;
    const isDriver = seat.isDriver;
    const isFolding = seat.isFolding;

    if (isDriver) {
      return `${baseClass} seat seat-driver cursor-default`;
    }

    if (readOnly) {
      if (isBooked) {
        return `${baseClass} seat seat-booked cursor-default`;
      }
      return `${baseClass} seat seat-available cursor-default opacity-50`;
    }

    if (isBooked) {
      return `${baseClass} seat seat-booked cursor-pointer`;
    }

    if (isFolding && !isBooked) {
      return `${baseClass} seat seat-folding hover:bg-muted-foreground/50`;
    }

    return `${baseClass} seat seat-available`;
  };

  const handleSeatClick = (seat: Seat) => {
    if (readOnly || seat.isDriver) return;
    onSeatClick?.(seat);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Front of vehicle indicator */}
      <div className="mb-4 px-6 py-2 bg-muted rounded-lg text-muted-foreground text-sm font-medium">
        🚐 Front
      </div>

      <div className="inline-flex flex-col gap-1.5">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5 justify-center">
            {row.map((seat, colIndex) => {
              if (!seat) {
                return (
                  <div
                    key={`empty-${rowIndex}-${colIndex}`}
                    className={compact ? 'w-8 h-8' : 'w-12 h-12'}
                  />
                );
              }

              const booking = getSeatBooking(seat.id);
              const isBooked = !!booking;
              const isDriver = seat.isDriver;
              const isFolding = seat.isFolding;

              const seatButton = (
                <button
                  key={seat.id}
                  type="button"
                  className={getSeatClass(seat, booking)}
                  onClick={() => handleSeatClick(seat)}
                  disabled={readOnly || isDriver}
                  title={
                    isDriver
                      ? 'Driver'
                      : booking
                      ? 'Booked'
                      : String(seat.id)
                  }
                >
                  {isDriver ? (
                    <User className="w-4 h-4" />
                  ) : isFolding && !isBooked ? (
                    'F'
                  ) : (
                    seat.id
                  )}
                </button>
              );

              // Wrap booked seats with tooltip
              if (booking && booking.passenger) {
                return (
                  <Tooltip key={seat.id}>
                    <TooltipTrigger asChild>
                      {seatButton}
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-semibold">{booking.passenger.name}</p>
                        <p className="text-muted-foreground">{booking.passenger.cnic}</p>
                        <p className="capitalize">{booking.passenger.gender}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return seatButton;
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className={`seat seat-available ${compact ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'}`}>1</div>
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`seat seat-booked ${compact ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'}`}>2</div>
          <span className="text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`seat seat-folding ${compact ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'}`}>F</div>
          <span className="text-muted-foreground">Folding</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`seat seat-driver ${compact ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'}`}>
            <User className="w-3 h-3" />
          </div>
          <span className="text-muted-foreground">Driver</span>
        </div>
      </div>
    </div>
  );
}
