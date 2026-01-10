import { useState, useEffect, useMemo } from 'react';
import { BookingTicket, Route } from '../types/booking';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CityCombobox } from './CityCombobox';
import { AlertCircle } from 'lucide-react';

interface TicketEditDialogProps {
  open: boolean;
  onClose: () => void;
  ticket: BookingTicket | null;
  availableRoutes: Route[];
  origin: string;
  onSave: (ticketId: string, updates: Partial<BookingTicket>) => void;
}

export function TicketEditDialog({
  open,
  onClose,
  ticket,
  availableRoutes,
  origin,
  onSave,
}: TicketEditDialogProps) {
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [destination, setDestination] = useState('');
  const [totalDiscount, setTotalDiscount] = useState('0');
  const [error, setError] = useState('');

  // Populate form when ticket changes
  useEffect(() => {
    if (ticket) {
      setName(ticket.passenger.name);
      setCnic(ticket.passenger.cnic);
      setGender(ticket.passenger.gender);
      setDestination(ticket.destination);
      setTotalDiscount(ticket.totalDiscount.toString());
      setError('');
    }
  }, [ticket]);

  const selectedRoute = useMemo(
    () => availableRoutes.find((r) => r.destination === destination),
    [destination, availableRoutes]
  );

  const totalBaseFare = useMemo(() => {
    if (!ticket || !selectedRoute) return 0;
    return selectedRoute.fare * ticket.seatIds.length;
  }, [ticket, selectedRoute]);

  const finalTotal = useMemo(() => {
    const discount = parseFloat(totalDiscount) || 0;
    return Math.max(0, totalBaseFare - discount);
  }, [totalBaseFare, totalDiscount]);

  // Format CNIC as user types
  const handleCnicChange = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 13) {
      if (digits.length > 5 && digits.length <= 12) {
        setCnic(`${digits.slice(0, 5)}-${digits.slice(5)}`);
      } else if (digits.length > 12) {
        setCnic(`${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`);
      } else {
        setCnic(digits);
      }
    }
  };

  const handleSave = () => {
    if (!ticket) return;

    try {
      setError('');

      // Validation
      if (!name.trim()) {
        throw new Error('Passenger name is required');
      }

      if (!cnic.match(/^\d{5}-\d{7}-\d$/)) {
        throw new Error('CNIC must be in format: XXXXX-XXXXXXX-X');
      }

      if (!destination) {
        throw new Error('Destination is required');
      }

      if (!selectedRoute) {
        throw new Error('Invalid destination selected');
      }

      const discountValue = parseFloat(totalDiscount) || 0;

      if (discountValue < 0) {
        throw new Error('Discount cannot be negative');
      }

      if (discountValue > totalBaseFare) {
        throw new Error('Discount cannot exceed total fare');
      }

      // Prepare updates
      const updates: Partial<BookingTicket> = {
        passenger: {
          name: name.trim(),
          cnic,
          gender,
        },
        destination,
        baseFarePerSeat: selectedRoute.fare,
        totalBaseFare,
        totalDiscount: discountValue,
        finalTotal,
      };

      onSave(ticket.id, updates);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Edit Ticket - Seats: {ticket.seatIds.join(', ')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Seat Badges */}
          <div className="flex items-center gap-2 flex-wrap p-3 bg-muted/30 rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Seats:</span>
            {ticket.seatIds.map((seatId) => (
              <Badge key={seatId} variant="secondary" className="font-bold">
                {seatId}
              </Badge>
            ))}
          </div>

          {/* Passenger Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Passenger Name *</Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* CNIC */}
          <div className="space-y-2">
            <Label htmlFor="cnic">CNIC *</Label>
            <Input
              id="cnic"
              placeholder="XXXXX-XXXXXXX-X"
              value={cnic}
              onChange={(e) => handleCnicChange(e.target.value)}
              className="h-12 text-base font-mono"
              maxLength={15}
            />
            <p className="text-xs text-muted-foreground">
              Format: 12345-1234567-1
            </p>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender *</Label>
            <RadioGroup value={gender} onValueChange={(v) => setGender(v as 'male' | 'female')}>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male-edit" />
                  <Label htmlFor="male-edit" className="font-normal cursor-pointer">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female-edit" />
                  <Label htmlFor="female-edit" className="font-normal cursor-pointer">
                    Female
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination">Destination *</Label>
            <CityCombobox
              value={destination}
              onValueChange={setDestination}
              placeholder="Select destination city"
            />
            <p className="text-xs text-muted-foreground">From: {origin}</p>
          </div>

          {/* Fare Summary */}
          {selectedRoute && (
            <div className="p-4 bg-primary/5 rounded-xl space-y-2 border border-primary/20">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {ticket.seatIds.length} seat{ticket.seatIds.length > 1 ? 's' : ''} × Rs. {selectedRoute.fare.toLocaleString()}
                </span>
                <span className="font-medium">Rs. {totalBaseFare.toLocaleString()}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Total Discount (Rs.)</Label>
                <Input
                  id="discount"
                  type="number"
                  placeholder="0"
                  value={totalDiscount}
                  onChange={(e) => setTotalDiscount(e.target.value)}
                  className="h-12 text-lg font-mono"
                  min="0"
                  max={totalBaseFare}
                />
              </div>

              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Final Total:</span>
                <span className="text-primary">Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleClose} className="h-12">
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="h-12 px-8">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
