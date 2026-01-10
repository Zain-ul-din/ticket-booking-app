import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CityCombobox } from "../components/CityCombobox";
import { useTerminal } from "../contexts/TerminalContext";
import { Building2 } from "lucide-react";

export default function TerminalSetup() {
  const router = useRouter();
  const { setTerminalInfo } = useTerminal();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const isValid = useMemo(() => {
    return Boolean(
      name.trim().length > 0 &&
        city &&
        area.trim().length > 0 &&
        contactNumber.trim().length > 0
    );
  }, [name, city, area, contactNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !city || !area.trim() || !contactNumber.trim()) {
      return;
    }

    // Save terminal info
    setTerminalInfo({
      name: name.trim(),
      city,
      area: area.trim(),
      contactNumber: contactNumber.trim(),
    });

    // Redirect to home
    router.push("/");
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4, 11)}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-card rounded-xl border border-border shadow-lg p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Terminal Setup</h1>
            <p className="text-muted-foreground">
              Configure your terminal before getting started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Terminal Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Terminal Name</Label>
                <Input
                  id="name"
                  placeholder="Enter terminal name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <CityCombobox
                  value={city}
                  onValueChange={setCity}
                  placeholder="Select city"
                  className="h-12"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Area / Landmark */}
              <div className="space-y-2">
                <Label htmlFor="area">Area / Landmark</Label>
                <Input
                  id="area"
                  placeholder="Enter area or landmark"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  placeholder="Enter contact number"
                  value={contactNumber}
                  onChange={(e) =>
                    setContactNumber(formatPhoneNumber(e.target.value))
                  }
                  className="h-12 font-mono"
                  maxLength={12}
                  required
                />
              </div>
            </div>
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base mt-6"
              disabled={!isValid}
            >
              Continue to Dashboard
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
