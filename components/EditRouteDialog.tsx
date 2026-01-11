import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useBooking } from "../contexts/BookingContext";
import { CityCombobox } from "./CityCombobox";
import { Route, VehicleType } from "../types/booking";
import { MapPin, DollarSign, Bus, Car } from "lucide-react";

interface EditRouteDialogProps {
  open: boolean;
  onClose: () => void;
  route: Route | null;
}

export function EditRouteDialog({ open, onClose, route }: EditRouteDialogProps) {
  const { updateRoute } = useBooking();
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType | "">("");
  const [fare, setFare] = useState("");

  // Pre-populate form when route changes
  useEffect(() => {
    if (route) {
      setDestination(route.destination);
      setVehicleType(route.vehicleType);
      setFare(route.fare.toString());
    }
  }, [route]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!route || !destination.trim() || !vehicleType || !fare) return;

    updateRoute(route.id, {
      destination: destination.trim(),
      vehicleType: vehicleType as VehicleType,
      fare: parseFloat(fare),
    });

    onClose();
  };

  if (!route) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Route</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Origin (Fixed, Read-only) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Origin
            </Label>
            <div className="h-12 px-3 py-2 rounded-md border border-input bg-muted/30 flex items-center">
              <span className="font-medium text-foreground">
                {route.origin}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Origin cannot be changed
            </p>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Destination
            </Label>
            <CityCombobox
              value={destination}
              onValueChange={setDestination}
              placeholder="Select destination city"
              className="h-12"
              excludeCities={[route.origin]}
              required
            />
            <p className="text-xs text-muted-foreground">
              {route.origin} is excluded from the list
            </p>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-muted-foreground" />
              Vehicle Type
            </Label>
            <Select
              value={vehicleType}
              onValueChange={(value) => setVehicleType(value as VehicleType)}
              required
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highroof">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    <span>Highroof</span>
                  </div>
                </SelectItem>
                <SelectItem value="bus">
                  <div className="flex items-center gap-2">
                    <Bus className="w-4 h-4" />
                    <span>Bus</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fare */}
          <div className="space-y-2">
            <Label htmlFor="fare" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Fare (Rs.)
            </Label>
            <Input
              id="fare"
              type="number"
              placeholder="e.g., 1500"
              value={fare}
              onChange={(e) => setFare(e.target.value)}
              className="h-12"
              min="0"
              required
            />
          </div>

          {/* Route Preview */}
          {destination && vehicleType && fare && (
            <div className="p-4 bg-primary/5 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2 text-center">
                Route Preview
              </p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-medium">{route.origin}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium">{destination}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                {vehicleType === "highroof" ? (
                  <Car className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Bus className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground capitalize">
                  {vehicleType}
                </span>
              </div>
              <p className="text-lg font-bold text-primary text-center">
                Rs. {parseFloat(fare || "0").toLocaleString()}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="px-8">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
