import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

// List of major cities in Pakistan
const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Larkana',
  'Hyderabad',
  'Gujrat',
  'Mardan',
  'Kasur',
  'Rahim Yar Khan',
  'Sahiwal',
  'Okara',
  'Wah Cantonment',
  'Dera Ghazi Khan',
  'Mirpur Khas',
  'Nawabshah',
  'Mingora',
  'Chiniot',
  'Kamoke',
  'Mandi Burewala',
  'Jhelum',
  'Sadiqabad',
  'Jacobabad',
  'Shikarpur',
  'Khanewal',
  'Hafizabad',
  'Kohat',
  'Muzaffargarh',
  'Khanpur',
  'Gojra',
  'Mandi Bahauddin',
  'Abbottabad',
  'Turbat',
  'Dadu',
  'Bahawalnagar',
  'Khuzdar',
  'Pakpattan',
  'Tando Allahyar',
  'Vihari',
  'Jaranwala',
  'New Mirpur',
].sort();

interface CityComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function CityCombobox({
  value,
  onValueChange,
  placeholder = 'Select city',
  className,
  required,
}: CityComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-required={required}
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            !value && 'text-muted-foreground',
            className
          )}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandEmpty>No city found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {CITIES.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === city ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {city}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
