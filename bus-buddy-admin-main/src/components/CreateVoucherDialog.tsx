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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBookingStore } from '@/store/bookingStore';
import { Calendar, Clock, MapPin, Phone, User, Bus } from 'lucide-react';

interface CreateVoucherDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateVoucherDialog({ open, onClose }: CreateVoucherDialogProps) {
  const { vehicles, routes, addVoucher } = useBookingStore();
  const [vehicleId, setVehicleId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [departureTime, setDepartureTime] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverMobile, setDriverMobile] = useState('');
  const [origin, setOrigin] = useState('');

  // Get unique origins from routes
  const uniqueOrigins = [...new Set(routes.map(r => r.origin))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !departureTime || !driverName || !driverMobile || !origin) return;

    addVoucher({
      vehicleId,
      date,
      origin: origin.trim(),
      departureTime,
      driverName: driverName.trim(),
      driverMobile: driverMobile.trim(),
      bookedSeats: [],
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setVehicleId('');
    setDate(new Date().toISOString().split('T')[0]);
    setDepartureTime('');
    setDriverName('');
    setDriverMobile('');
    setOrigin('');
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4, 11)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Daily Voucher</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-muted-foreground" />
              Select Vehicle
            </Label>
            <Select value={vehicleId} onValueChange={setVehicleId} required>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name} ({v.registrationNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Departure Time
              </Label>
              <Input
                id="time"
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="origin" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Starting Point (Origin)
            </Label>
            <Select value={origin} onValueChange={setOrigin} required>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select starting city" />
              </SelectTrigger>
              <SelectContent>
                {uniqueOrigins.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Passengers will select their destination when booking
            </p>
          </div>

          <div className="p-4 bg-muted/30 rounded-xl space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Driver Information</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driverName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Driver Name
                </Label>
                <Input
                  id="driverName"
                  placeholder="Enter name"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverMobile" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Mobile Number
                </Label>
                <Input
                  id="driverMobile"
                  placeholder="0300-1234567"
                  value={driverMobile}
                  onChange={(e) => setDriverMobile(formatPhoneNumber(e.target.value))}
                  className="h-12 font-mono"
                  maxLength={12}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="px-8">
              Create Voucher
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
