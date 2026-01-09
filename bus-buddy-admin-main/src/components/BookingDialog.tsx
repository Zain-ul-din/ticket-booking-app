import { useState, useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SeatConfig, Passenger, Route, BookedSeat } from '@/types/booking';
import { User, CreditCard, Users, MapPin, Percent } from 'lucide-react';

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  seat: SeatConfig | null;
  onBook: (booking: Omit<BookedSeat, 'seatId'>) => void;
  editMode?: boolean;
  existingBooking?: BookedSeat | null;
  availableRoutes: Route[];
  origin: string;
}

export function BookingDialog({ 
  open, 
  onClose, 
  seat, 
  onBook, 
  editMode = false, 
  existingBooking = null,
  availableRoutes,
  origin
}: BookingDialogProps) {
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [discount, setDiscount] = useState('0');

  const selectedRoute = availableRoutes.find(r => r.id === selectedRouteId);
  const fare = selectedRoute?.fare || 0;
  const discountAmount = parseFloat(discount) || 0;
  const finalFare = Math.max(0, fare - discountAmount);

  // Populate fields when editing or reset when opening
  useEffect(() => {
    if (editMode && existingBooking) {
      setName(existingBooking.passenger.name);
      setCnic(existingBooking.passenger.cnic);
      setGender(existingBooking.passenger.gender);
      setDiscount(existingBooking.discount.toString());
      // Find route by destination
      const route = availableRoutes.find(r => r.destination === existingBooking.destination);
      if (route) {
        setSelectedRouteId(route.id);
      }
    } else if (!editMode && open) {
      setName('');
      setCnic('');
      setGender('male');
      setSelectedRouteId('');
      setDiscount('0');
    }
  }, [editMode, existingBooking, open, availableRoutes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cnic.trim() || !selectedRoute) return;
    
    onBook({ 
      passenger: { name: name.trim(), cnic: cnic.trim(), gender },
      destination: selectedRoute.destination,
      fare: selectedRoute.fare,
      discount: discountAmount,
      finalFare
    });
    
    setName('');
    setCnic('');
    setGender('male');
    setSelectedRouteId('');
    setDiscount('0');
    onClose();
  };

  const formatCnic = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">{seat?.id}</span>
            </div>
            {editMode ? 'Edit' : 'Book'} Seat #{seat?.id}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Destination Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Destination (from {origin})
            </Label>
            <Select value={selectedRouteId} onValueChange={setSelectedRouteId} required>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {availableRoutes.map((route) => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.destination} — Rs. {route.fare.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Passenger Info */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-muted-foreground" />
              Passenger Name
            </Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnic" className="flex items-center gap-2 text-base">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              CNIC Number
            </Label>
            <Input
              id="cnic"
              placeholder="XXXXX-XXXXXXX-X"
              value={cnic}
              onChange={(e) => setCnic(formatCnic(e.target.value))}
              className="h-12 text-lg font-mono"
              maxLength={15}
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4 text-muted-foreground" />
              Gender
            </Label>
            <RadioGroup
              value={gender}
              onValueChange={(v) => setGender(v as 'male' | 'female')}
              className="flex gap-4"
            >
              <div className="flex-1">
                <RadioGroupItem value="male" id="male" className="peer sr-only" />
                <Label
                  htmlFor="male"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                >
                  <span className="text-xl">👨</span>
                  <span className="font-medium">Male</span>
                </Label>
              </div>
              <div className="flex-1">
                <RadioGroupItem value="female" id="female" className="peer sr-only" />
                <Label
                  htmlFor="female"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                >
                  <span className="text-xl">👩</span>
                  <span className="font-medium">Female</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <Label htmlFor="discount" className="flex items-center gap-2 text-base">
              <Percent className="w-4 h-4 text-muted-foreground" />
              Discount Amount (Rs.)
            </Label>
            <Input
              id="discount"
              type="number"
              placeholder="0"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="h-12"
              min="0"
              max={fare}
            />
          </div>

          {/* Fare Summary */}
          {selectedRoute && (
            <div className="p-4 bg-primary/5 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Fare:</span>
                <span>Rs. {fare.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">Rs. {finalFare.toLocaleString()}</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="h-12">
              Cancel
            </Button>
            <Button type="submit" className="h-12 px-8" disabled={!selectedRoute}>
              {editMode ? 'Save Changes' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
