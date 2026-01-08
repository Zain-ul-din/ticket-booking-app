import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { BookedSeat } from '../types/booking';

interface CancelBookingDialogProps {
  open: boolean;
  onClose: () => void;
  booking: BookedSeat | null;
  onConfirm: () => void;
}

export function CancelBookingDialog({
  open,
  onClose,
  booking,
  onConfirm,
}: CancelBookingDialogProps) {
  if (!booking) return null;

  const genderEmoji = booking.passenger.gender === 'male' ? '👨' : '👩';

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Seat Booking?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel the booking for seat {booking.seatId}?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 p-4 rounded-lg bg-muted">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{genderEmoji}</span>
              <div>
                <p className="font-semibold">{booking.passenger.name}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.passenger.cnic}
                </p>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Keep Booking</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, Cancel Booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
