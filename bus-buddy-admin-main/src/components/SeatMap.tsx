import { SeatConfig, BookedSeat } from '@/types/booking';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SeatMapProps {
  seats: SeatConfig[];
  bookedSeats?: BookedSeat[];
  onSeatClick?: (seat: SeatConfig) => void;
  readOnly?: boolean;
  compact?: boolean;
}

export function SeatMap({ seats, bookedSeats = [], onSeatClick, readOnly = false, compact = false }: SeatMapProps) {
  const maxRow = Math.max(...seats.map(s => s.row));
  const maxCol = Math.max(...seats.map(s => s.col));
  
  const getSeatStatus = (seatId: number) => {
    return bookedSeats.find(bs => bs.seatId === seatId);
  };

  const getSeatByPosition = (row: number, col: number) => {
    return seats.find(s => s.row === row && s.col === col);
  };

  const seatSize = compact ? 'w-8 h-8 text-xs' : 'w-12 h-12 text-sm';

  return (
    <div className="flex flex-col items-center">
      {/* Front of vehicle indicator */}
      <div className="mb-4 px-6 py-2 bg-muted rounded-lg text-muted-foreground text-sm font-medium">
        🚐 Front
      </div>
      
      <div className="inline-flex flex-col gap-1.5">
        {Array.from({ length: maxRow + 1 }, (_, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5 justify-center">
            {Array.from({ length: maxCol + 1 }, (_, colIndex) => {
              const seat = getSeatByPosition(rowIndex, colIndex);
              
              if (!seat) {
                return <div key={colIndex} className={cn(seatSize)} />;
              }

              const booking = getSeatStatus(seat.id);
              const isBooked = !!booking;
              const isDriver = seat.isDriver;
              const isFolding = seat.isFolding;

              const seatElement = (
                <button
                  key={seat.id}
                  onClick={() => !readOnly && !isDriver && onSeatClick?.(seat)}
                  disabled={readOnly || isDriver}
                  className={cn(
                    'seat',
                    seatSize,
                    isDriver && 'seat-driver cursor-default',
                    !isDriver && !isBooked && !isFolding && 'seat-available',
                    !isDriver && isBooked && 'seat-booked',
                    !isDriver && isFolding && !isBooked && 'seat-folding',
                    readOnly && 'cursor-default'
                  )}
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

              if (isBooked && booking.passenger) {
                return (
                  <Tooltip key={seat.id}>
                    <TooltipTrigger asChild>
                      {seatElement}
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

              return seatElement;
            })}
            
            {/* Add aisle indicator between seats */}
            {rowIndex === 0 && maxCol >= 3 && (
              <div className="absolute left-1/2 -translate-x-1/2 text-xs text-muted-foreground mt-14">
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className={cn('seat seat-available', compact ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs')}>1</div>
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn('seat seat-booked', compact ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs')}>2</div>
          <span className="text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn('seat seat-folding', compact ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs')}>F</div>
          <span className="text-muted-foreground">Folding</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn('seat seat-driver', compact ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs')}>
            <User className="w-3 h-3" />
          </div>
          <span className="text-muted-foreground">Driver</span>
        </div>
      </div>
    </div>
  );
}
