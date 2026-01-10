import { cn } from "@/lib/utils";
import { Seat, BookedSeat } from "../types/booking";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface SeatMapProps {
  seats: Seat[];
  bookedSeats?: BookedSeat[];
  onSeatClick?: (seat: Seat) => void;
  readOnly?: boolean;
  compact?: boolean;
  selectedSeats?: Seat[];
  hideLabels?: boolean;
}

export function SeatMap({
  seats,
  bookedSeats = [],
  readOnly = false,
  compact = false,
  selectedSeats = [],
  onSeatClick,
  hideLabels,
}: SeatMapProps) {
  // Get grid dimensions from seats
  const maxRow = seats.length > 0 ? Math.max(...seats.map((s) => s.row)) : 0;
  const maxCol = seats.length > 0 ? Math.max(...seats.map((s) => s.col)) : 0;

  // Create a 2D grid
  const grid: (Seat | null)[][] = Array(maxRow + 1)
    .fill(null)
    .map(() => Array(maxCol + 1).fill(null));

  // Fill the grid with seats
  seats.forEach((seat) => {
    grid[seat.row][seat.col] = seat;
  });

  // Check if seat is booked
  const getSeatBooking = (seatId: number) => {
    return bookedSeats.find((bs) => bs.seatId === seatId);
  };

  // Check if seat is selected (bulk mode)
  const isSeatSelected = (seatId: number) => {
    return selectedSeats.some((s) => s.id === seatId);
  };

  const getSeatClass = (seat: Seat, booking?: BookedSeat) => {
    const baseClass = compact ? "w-8 h-8 text-xs" : "w-12 h-12 text-sm";
    const isBooked = !!booking;

    if (readOnly) {
      if (isBooked) {
        return `${baseClass} seat seat-booked cursor-default`;
      }
      return `${baseClass} seat seat-available cursor-default opacity-50`;
    }

    if (isBooked) {
      return `${baseClass} seat seat-booked cursor-pointer`;
    }

    return `${baseClass} seat seat-available cursor-pointer`;
  };

  const handleSeatClick = (seat: Seat) => {
    if (readOnly) return;
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
                    className={compact ? "w-8 h-8" : "w-12 h-12"}
                  />
                );
              }

              const booking = getSeatBooking(seat.id);

              const seatContent = booking ? (
                // Booked: show gender emoji + seat number
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <span className="text-base leading-none">
                    {booking.passenger.gender === "male" ? "👨" : "👩"}
                  </span>
                  <span className="text-xs font-semibold leading-none">
                    {seat.id}
                  </span>
                </div>
              ) : (
                // Available: show just seat number
                <span className="text-sm font-semibold">
                  {seat.isFolding ? "F" : seat.id}
                </span>
              );

              const seatButton = (
                <button
                  key={seat.id}
                  type="button"
                  className={getSeatClass(seat, booking)}
                  onClick={() => handleSeatClick(seat)}
                  disabled={readOnly}
                >
                  {seatContent}
                </button>
              );

              // Wrap booked seats with tooltip
              if (booking && booking.passenger) {
                return (
                  <Tooltip key={seat.id}>
                    <TooltipTrigger asChild>{seatButton}</TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-semibold">
                          {booking.passenger.name}
                        </p>
                        <p className="text-muted-foreground font-mono">
                          {booking.passenger.cnic}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {booking.passenger.gender}
                        </p>
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

      <div
        className={cn(
          "mt-6 flex flex-wrap gap-4 justify-center text-sm",
          hideLabels && "hidden"
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={`seat seat-available ${
              compact ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs"
            }`}
          >
            1
          </div>
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`seat seat-booked ${
              compact ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-0.5">
              <span className="text-xs leading-none">👨</span>
              <span className="text-[10px] font-semibold leading-none">2</span>
            </div>
          </div>
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>
    </div>
  );
}
