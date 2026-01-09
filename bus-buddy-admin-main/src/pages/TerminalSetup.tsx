import { useState } from 'react';
import { useBookingStore } from '@/store/bookingStore';
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
import { Building2 } from 'lucide-react';

const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Faisalabad',
  'Rawalpindi',
  'Multan',
  'Hyderabad',
  'Gujranwala',
  'Peshawar',
  'Quetta',
  'Islamabad',
  'Sargodha',
  'Sialkot',
  'Bahawalpur',
  'Sukkur',
  'Jhang',
  'Sheikhupura',
  'Larkana',
  'Mardan',
  'Gujrat',
  'Kasur',
];

const TerminalSetup = () => {
  const { setTerminal } = useBookingStore();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Terminal name is required';
    }
    if (!city) {
      newErrors.city = 'Please select a city';
    }
    if (!area.trim()) {
      newErrors.area = 'Area / Landmark is required';
    }
    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^[\d\-+() ]{10,15}$/.test(contactNumber.trim())) {
      newErrors.contactNumber = 'Please enter a valid contact number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setTerminal({
      name: name.trim(),
      city,
      area: area.trim(),
      contactNumber: contactNumber.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="section-card">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Terminal Setup</h1>
            <p className="text-muted-foreground text-center mt-2">
              Configure your terminal before getting started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Terminal Name</Label>
              <Input
                id="name"
                placeholder="Enter terminal name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className={errors.city ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {PAKISTAN_CITIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area / Landmark</Label>
              <Input
                id="area"
                placeholder="Enter area or landmark"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className={errors.area ? 'border-destructive' : ''}
              />
              {errors.area && (
                <p className="text-sm text-destructive">{errors.area}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                placeholder="Enter contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className={errors.contactNumber ? 'border-destructive' : ''}
              />
              {errors.contactNumber && (
                <p className="text-sm text-destructive">{errors.contactNumber}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-6">
              Continue to Dashboard
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TerminalSetup;
