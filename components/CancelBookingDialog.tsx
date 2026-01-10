import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookingTicket } from '../types/booking';
import { Trash2, AlertTriangle } from 'lucide-react';

interface CancelBookingDialogProps {
  open: boolean;
  onClose: () => void;
  ticket: BookingTicket | null;
  onCancel: () => void;
}

export function CancelBookingDialog({
  open,
  onClose,
  ticket,
  onCancel,
}: CancelBookingDialogProps) {
  if (!ticket) return null;

  const genderEmoji = ticket.passenger.gender === 'male' ? '👨' : '👩';
  const multipleSeats = ticket.seatIds.length > 1;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Cancel Booking
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this booking?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Seat Badges */}
          <div className="flex items-center gap-2 flex-wrap p-3 bg-muted/30 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">
              {multipleSeats ? 'Seats:' : 'Seat:'}
            </span>
            {ticket.seatIds.map((seatId) => (
              <Badge key={seatId} variant="destructive" className="font-bold">
                {seatId}
              </Badge>
            ))}
          </div>

          {/* Passenger Info */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{genderEmoji}</span>
              <p className="font-medium text-foreground">{ticket.passenger.name}</p>
            </div>
            <p className="text-sm font-mono text-muted-foreground">{ticket.passenger.cnic}</p>
            <p className="text-sm text-muted-foreground">To: {ticket.destination}</p>
          </div>

          {/* Fare Info */}
          <div className="p-3 bg-primary/5 rounded-lg space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Fare:</span>
              <span className="font-medium">Rs. {ticket.totalBaseFare.toLocaleString()}</span>
            </div>
            {ticket.totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>- Rs. {ticket.totalDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-1 border-t">
              <span>Final Total:</span>
              <span className="text-primary">Rs. {ticket.finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {multipleSeats && (
            <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-sm text-orange-900 dark:text-orange-100 font-medium">
                All {ticket.seatIds.length} seats will be freed and available for new bookings.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="h-12 flex-1">
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            onClick={onCancel}
            className="h-12 flex-1 gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Yes, Cancel Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
