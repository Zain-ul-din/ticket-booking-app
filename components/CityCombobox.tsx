"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cities } from "@/lib/constants/cities";

const CITIES = cities.map((city) => ({
  label: city.label,
  value: city.city_name.toLowerCase(),
}));

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
  placeholder = "Select city",
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
    (city) => !excludeCities.map((c) => c.toLowerCase()).includes(city.value)
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
            "flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            !value && "text-muted-foreground",
            className
          )}
        >
          {value
            ? CITIES.find((city) => city.value === internalValue)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0 z-[100]">
        <Command>
          <CommandInput placeholder="Search city..." className="h-9" />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {availableCities.map((city) => (
                <CommandItem
                  data-me="you"
                  key={city.value}
                  value={city.value}
                  onSelect={(currentValue) => {
                    // Find the proper case label
                    const selected = CITIES.find(
                      (c) => c.value === currentValue
                    );

                    onValueChange(
                      currentValue === internalValue
                        ? ""
                        : selected?.value || ""
                    );
                    setOpen(false);
                  }}
                  onClick={() => {
                    // Fallback onClick handler
                    onValueChange(
                      city.value === internalValue ? "" : city.label
                    );
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
