import { useState } from 'react';
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
import { Seat, Passenger } from '../types/booking';
import { User, CreditCard, Users } from 'lucide-react';

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  seat: Seat | null;
  onBook: (passenger: Passenger) => void;
}

export function BookingDialog({ open, onClose, seat, onBook }: BookingDialogProps) {
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cnic.trim()) return;

    onBook({ name: name.trim(), cnic: cnic.trim(), gender });
    setName('');
    setCnic('');
    setGender('male');
    onClose();
  };

  const formatCnic = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Format as XXXXX-XXXXXXX-X
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
            Book Seat #{seat?.id}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                <RadioGroupItem
                  value="male"
                  id="male"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="male"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                >
                  <span className="text-2xl">👨</span>
                  <span className="font-medium">Male</span>
                </Label>
              </div>
              <div className="flex-1">
                <RadioGroupItem
                  value="female"
                  id="female"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="female"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                >
                  <span className="text-2xl">👩</span>
                  <span className="font-medium">Female</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="h-12">
              Cancel
            </Button>
            <Button type="submit" className="h-12 px-8">
              Confirm Booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
