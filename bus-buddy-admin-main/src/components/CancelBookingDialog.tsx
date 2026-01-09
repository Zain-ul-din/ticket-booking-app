import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookedSeat } from '@/types/booking';
import { Pencil, Trash2 } from 'lucide-react';

interface CancelBookingDialogProps {
  open: boolean;
  onClose: () => void;
  booking: BookedSeat | null;
  onCancel: () => void;
  onEdit: () => void;
}

export function CancelBookingDialog({ open, onClose, booking, onCancel, onEdit }: CancelBookingDialogProps) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seat #{booking.seatId} - Booked</DialogTitle>
          <DialogDescription>
            What would you like to do with this booking?
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted p-4 rounded-lg space-y-1">
          <p className="font-medium text-foreground">{booking.passenger.name}</p>
          <p className="text-sm font-mono text-muted-foreground">{booking.passenger.cnic}</p>
          <p className="text-sm capitalize text-muted-foreground">{booking.passenger.gender}</p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="h-12 flex-1">
            Close
          </Button>
          <Button variant="outline" onClick={onEdit} className="h-12 flex-1 gap-2">
            <Pencil className="w-4 h-4" />
            Edit Details
          </Button>
          <Button variant="destructive" onClick={onCancel} className="h-12 flex-1 gap-2">
            <Trash2 className="w-4 h-4" />
            Cancel Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}