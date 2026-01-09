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
// Structure: { value: lowercase for cmdk matching, label: proper case for display }
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
  excludeCities?: string[];  // Cities to exclude from the list (proper case)
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

  // Filter out excluded cities (excludeCities comes in proper case, so compare against labels)
  const availableCities = CITIES.filter(city => !excludeCities.includes(city.label));

  // Get the current city object for display
  const selectedCity = CITIES.find(city => city.label === value);

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
          {selectedCity ? selectedCity.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandEmpty>No city found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {availableCities.map((city) => {
                // Check if this city is currently selected
                // Compare using lowercase values since cmdk works with lowercase
                const isSelected = selectedCity?.value === city.value;

                return (
                  <CommandItem
                    key={city.value}
                    value={city.value}  // lowercase for cmdk matching
                    onSelect={(currentValue) => {
                      // currentValue is lowercased by cmdk
                      // Find the city object to get the proper case label
                      const clickedCity = CITIES.find(c => c.value === currentValue);
                      if (clickedCity) {
                        // Toggle: if already selected, clear; otherwise set to proper case label
                        onValueChange(isSelected ? '' : clickedCity.label);
                      }
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {city.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
