import { useState } from 'react';
import { Seat, Route } from '../types/booking';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CityCombobox } from './CityCombobox';
import { Label } from './ui/label';
import { X } from 'lucide-react';

interface BulkBookingDialogProps {
  open: boolean;
  onClose: () => void;
  seats: Seat[];
  availableRoutes: Route[];
  origin: string;
  onBook: (destination: string, fare: number) => void;
}

export function BulkBookingDialog({
  open,
  onClose,
  seats,
  availableRoutes,
  origin,
  onBook,
}: BulkBookingDialogProps) {
  const [destination, setDestination] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    const route = availableRoutes.find(r => r.destination === value);
    setSelectedRoute(route || null);
  };

  const handleNext = () => {
    if (!destination || !selectedRoute) {
      alert('Please select a destination');
      return;
    }

    // For now, just book all seats with the same fare
    // TODO: Add passenger details form in next phase
    onBook(destination, selectedRoute.fare);
  };

  const handleClose = () => {
    setDestination('');
    setSelectedRoute(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bulk Booking - {seats.length} Seats</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Seats Display */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">
                Seats:
              </span>
              {seats.map((seat) => (
                <Badge
                  key={seat.id}
                  className="px-3 py-1 text-sm font-bold bg-orange-500 text-white"
                >
                  {seat.id}
                </Badge>
              ))}
            </div>
          </div>

          {/* Destination Selection */}
          <div className="space-y-2">
            <Label htmlFor="destination">Destination *</Label>
            <CityCombobox
              value={destination}
              onValueChange={handleDestinationChange}
              placeholder="Select destination city"
            />
            <p className="text-xs text-muted-foreground">
              From: {origin}
            </p>
          </div>

          {/* Fare Display */}
          {selectedRoute && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Fare per seat:</span>
                <span className="text-xl font-bold text-primary">
                  Rs. {selectedRoute.fare.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                <span className="text-sm font-medium">Total ({seats.length} seats):</span>
                <span className="text-2xl font-bold text-primary">
                  Rs. {(selectedRoute.fare * seats.length).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleNext} disabled={!destination || !selectedRoute}>
              Next: Enter Passenger Details →
            </Button>
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground text-center">
            Note: You'll enter individual passenger details in the next step
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
