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
  { value: 'abbottabad', label: 'Abbottabad' },
  { value: 'bahawalnagar', label: 'Bahawalnagar' },
  { value: 'bahawalpur', label: 'Bahawalpur' },
  { value: 'chiniot', label: 'Chiniot' },
  { value: 'dadu', label: 'Dadu' },
  { value: 'dera ghazi khan', label: 'Dera Ghazi Khan' },
  { value: 'faisalabad', label: 'Faisalabad' },
  { value: 'gojra', label: 'Gojra' },
  { value: 'gujranwala', label: 'Gujranwala' },
  { value: 'gujrat', label: 'Gujrat' },
  { value: 'hafizabad', label: 'Hafizabad' },
  { value: 'hyderabad', label: 'Hyderabad' },
  { value: 'islamabad', label: 'Islamabad' },
  { value: 'jacobabad', label: 'Jacobabad' },
  { value: 'jaranwala', label: 'Jaranwala' },
  { value: 'jhelum', label: 'Jhelum' },
  { value: 'kamoke', label: 'Kamoke' },
  { value: 'karachi', label: 'Karachi' },
  { value: 'kasur', label: 'Kasur' },
  { value: 'khanewal', label: 'Khanewal' },
  { value: 'khanpur', label: 'Khanpur' },
  { value: 'khuzdar', label: 'Khuzdar' },
  { value: 'kohat', label: 'Kohat' },
  { value: 'lahore', label: 'Lahore' },
  { value: 'larkana', label: 'Larkana' },
  { value: 'mandi bahauddin', label: 'Mandi Bahauddin' },
  { value: 'mandi burewala', label: 'Mandi Burewala' },
  { value: 'mardan', label: 'Mardan' },
  { value: 'mingora', label: 'Mingora' },
  { value: 'mirpur khas', label: 'Mirpur Khas' },
  { value: 'multan', label: 'Multan' },
  { value: 'muzaffargarh', label: 'Muzaffargarh' },
  { value: 'nawabshah', label: 'Nawabshah' },
  { value: 'new mirpur', label: 'New Mirpur' },
  { value: 'okara', label: 'Okara' },
  { value: 'pakpattan', label: 'Pakpattan' },
  { value: 'peshawar', label: 'Peshawar' },
  { value: 'quetta', label: 'Quetta' },
  { value: 'rahim yar khan', label: 'Rahim Yar Khan' },
  { value: 'rawalpindi', label: 'Rawalpindi' },
  { value: 'sadiqabad', label: 'Sadiqabad' },
  { value: 'sahiwal', label: 'Sahiwal' },
  { value: 'sargodha', label: 'Sargodha' },
  { value: 'shikarpur', label: 'Shikarpur' },
  { value: 'sialkot', label: 'Sialkot' },
  { value: 'sukkur', label: 'Sukkur' },
  { value: 'tando allahyar', label: 'Tando Allahyar' },
  { value: 'turbat', label: 'Turbat' },
  { value: 'vihari', label: 'Vihari' },
  { value: 'wah cantonment', label: 'Wah Cantonment' },
];

interface CityComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  excludeCities?: string[];
  disabled?: boolean;
}

export function CityCombobox({
  value,
  onValueChange,
  placeholder = 'Select city',
  className,
  required,
  excludeCities = [],
  disabled = false,
}: CityComboboxProps) {
  const [open, setOpen] = useState(false);

  // Convert value to lowercase for internal comparison
  const internalValue = value.toLowerCase();

  // Filter out excluded cities
  const availableCities = CITIES.filter(
    city => !excludeCities.map(c => c.toLowerCase()).includes(city.value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-required={required}
          disabled={disabled}
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            !value && 'text-muted-foreground',
            className
          )}
        >
          {value
            ? CITIES.find((city) => city.value === internalValue)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[100]">
        <Command>
          <CommandInput placeholder="Search city..." className="h-9" />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {availableCities.map((city) => (
                <CommandItem
                  key={city.value}
                  value={city.value}
                  onSelect={(currentValue) => {
                    // Find the proper case label
                    const selected = CITIES.find(c => c.value === currentValue);
                    onValueChange(currentValue === internalValue ? "" : (selected?.label || ""));
                    setOpen(false);
                  }}
                  onClick={() => {
                    // Fallback onClick handler
                    onValueChange(city.value === internalValue ? "" : city.label);
                    setOpen(false);
                  }}
                >
                  {city.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      internalValue === city.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
