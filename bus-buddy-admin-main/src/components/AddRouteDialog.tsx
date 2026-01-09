import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBookingStore } from '@/store/bookingStore';
import { MapPin, DollarSign, ArrowRight } from 'lucide-react';

interface AddRouteDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddRouteDialog({ open, onClose }: AddRouteDialogProps) {
  const { addRoute } = useBookingStore();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [fare, setFare] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim() || !fare) return;

    addRoute({
      origin: origin.trim(),
      destination: destination.trim(),
      fare: parseFloat(fare),
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setOrigin('');
    setDestination('');
    setFare('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Route</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Origin (Starting City)
            </Label>
            <Input
              id="origin"
              placeholder="e.g., Multan"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Destination
            </Label>
            <Input
              id="destination"
              placeholder="e.g., Lahore"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fare" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Fare (Rs.)
            </Label>
            <Input
              id="fare"
              type="number"
              placeholder="e.g., 1500"
              value={fare}
              onChange={(e) => setFare(e.target.value)}
              className="h-12"
              min="0"
              required
            />
          </div>

          {origin && destination && fare && (
            <div className="p-4 bg-primary/5 rounded-xl text-center">
              <p className="text-sm text-muted-foreground mb-1">Route Preview</p>
              <p className="font-medium">
                {origin} → {destination}
              </p>
              <p className="text-lg font-bold text-primary">
                Rs. {parseFloat(fare || '0').toLocaleString()}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="px-8">
              Add Route
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
