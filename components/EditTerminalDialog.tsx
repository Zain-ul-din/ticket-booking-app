import { useState, useEffect } from 'react';
import { TerminalInfo } from '../contexts/TerminalContext';
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
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, Building2, MapPin, Phone } from 'lucide-react';

interface EditTerminalDialogProps {
  open: boolean;
  onClose: () => void;
  terminalInfo: TerminalInfo | null;
  onSave: (info: TerminalInfo) => void;
}

export function EditTerminalDialog({
  open,
  onClose,
  terminalInfo,
  onSave,
}: EditTerminalDialogProps) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (terminalInfo) {
      setName(terminalInfo.name);
      setCity(terminalInfo.city);
      setArea(terminalInfo.area);
      setContactNumber(terminalInfo.contactNumber);
    }
  }, [terminalInfo]);

  const handleSave = () => {
    try {
      setError('');

      // Validation
      if (!name.trim()) {
        throw new Error('Terminal name is required');
      }
      if (!city.trim()) {
        throw new Error('City is required');
      }
      if (!area.trim()) {
        throw new Error('Area is required');
      }
      if (!contactNumber.trim()) {
        throw new Error('Contact number is required');
      }

      onSave({
        name: name.trim(),
        city: city.trim(),
        area: area.trim(),
        contactNumber: contactNumber.trim(),
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Terminal Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Terminal Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              Terminal Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter terminal/company name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              City *
            </Label>
            <Input
              id="city"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* Area */}
          <div className="space-y-2">
            <Label htmlFor="area" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Area *
            </Label>
            <Input
              id="area"
              placeholder="Enter area/location"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <Label htmlFor="contactNumber" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Contact Number *
            </Label>
            <Input
              id="contactNumber"
              type="tel"
              placeholder="Enter contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="h-12 text-base"
            />
          </div>

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
