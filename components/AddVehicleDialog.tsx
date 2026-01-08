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
import { VehicleType, HIGHROOF_LAYOUT, generateBusLayout } from '../types/booking';
import { Bus, Car } from 'lucide-react';

interface AddVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (vehicle: {
    name: string;
    registrationNumber: string;
    type: VehicleType;
    seats: any[];
    totalSeats: number;
  }) => void;
}

export function AddVehicleDialog({ open, onClose, onAdd }: AddVehicleDialogProps) {
  const [name, setName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [type, setType] = useState<VehicleType>('highroof');
  const [rows, setRows] = useState(12);
  const [cols, setCols] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !regNumber.trim()) return;

    const seats = type === 'highroof'
      ? HIGHROOF_LAYOUT
      : generateBusLayout(rows, cols);

    const totalSeats = type === 'highroof'
      ? HIGHROOF_LAYOUT.filter(s => s.type !== 'driver').length
      : rows * cols;

    onAdd({
      name: name.trim(),
      registrationNumber: regNumber.trim().toUpperCase(),
      type,
      seats,
      totalSeats,
    });

    setName('');
    setRegNumber('');
    setType('highroof');
    setRows(12);
    setCols(4);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Vehicle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="vehicleName">Vehicle Name</Label>
            <Input
              id="vehicleName"
              placeholder="e.g., Al-Mukhtar Express"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="regNumber">Registration Number</Label>
            <Input
              id="regNumber"
              placeholder="e.g., LEA-1234"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="h-12 font-mono uppercase"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Vehicle Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as VehicleType)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="highroof"
                  id="highroof"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="highroof"
                  className="flex flex-col items-center gap-3 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                >
                  <Car className="w-8 h-8" />
                  <div className="text-center">
                    <span className="font-medium block">High Roof</span>
                    <span className="text-xs text-muted-foreground">11 seats</span>
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="bus"
                  id="bus"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="bus"
                  className="flex flex-col items-center gap-3 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                >
                  <Bus className="w-8 h-8" />
                  <div className="text-center">
                    <span className="font-medium block">Bus</span>
                    <span className="text-xs text-muted-foreground">Custom seats</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {type === 'bus' && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="space-y-2">
                <Label htmlFor="rows">Number of Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min={4}
                  max={20}
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value) || 12)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cols">Seats per Row</Label>
                <Input
                  id="cols"
                  type="number"
                  min={2}
                  max={6}
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value) || 4)}
                  className="h-10"
                />
              </div>
              <div className="col-span-2 text-center text-sm text-muted-foreground">
                Total: {rows * cols} seats
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="px-8">
              Add Vehicle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
