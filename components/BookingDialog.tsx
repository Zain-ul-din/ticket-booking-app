import { useState, useEffect } from "react";
import Link from "next/link";
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
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Seat, Route, BookedSeat } from "../types/booking";
import { User, CreditCard, Users, MapPin, Percent, Phone } from "lucide-react";

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  seat: Seat | null;
  onBook: (ticketData: {
    passenger: {
      name?: string;
      cnic?: string;
      phone?: string;
      gender: "male" | "female";
    };
    destination: string;
    baseFarePerSeat: number;
    totalDiscount: number;
  }) => void;
  editMode?: boolean;
  existingBooking?: BookedSeat | null;
  availableRoutes: Route[];
  origin: string;
  selectedSeats?: Seat[];
}

export function BookingDialog({
  open,
  onClose,
  seat,
  onBook,
  editMode = false,
  existingBooking = null,
  availableRoutes,
  origin,
  selectedSeats = [],
}: BookingDialogProps) {
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [discount, setDiscount] = useState("0");

  const selectedRoute = availableRoutes.find((r) => r.id === selectedRouteId);
  const baseFarePerSeat = selectedRoute?.fare || 0;
  const seatCount = selectedSeats.length > 0 ? selectedSeats.length : 1;
  const totalBaseFare = baseFarePerSeat * seatCount;
  const totalDiscount = parseFloat(discount) || 0;
  const finalTotal = Math.max(0, totalBaseFare - totalDiscount);

  // Populate fields when editing or reset when opening
  useEffect(() => {
    if (editMode && existingBooking) {
      setName(existingBooking.passenger.name || "");
      setCnic(existingBooking.passenger.cnic || "");
      setPhone(existingBooking.passenger.phone || "");
      setGender(existingBooking.passenger.gender || "male");
      setDiscount(existingBooking.discount.toString());
      // Find route by destination
      const route = availableRoutes.find(
        (r) => r.destination === existingBooking.destination
      );
      if (route) {
        setSelectedRouteId(route.id);
      }
    } else if (!editMode && open) {
      setName("");
      setCnic("");
      setPhone("");
      setGender("male");
      setSelectedRouteId("");
      setDiscount("0");
    }
  }, [editMode, existingBooking, open, availableRoutes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate CNIC format only if provided
    if (cnic.trim() && !cnic.match(/^\d{5}-\d{7}-\d$/)) {
      alert('CNIC must be in format: XXXXX-XXXXXXX-X');
      return;
    }

    // Must select a route
    if (!selectedRoute) return;

    onBook({
      passenger: {
        name: name.trim() || undefined,
        cnic: cnic.trim() || undefined,
        phone: phone.trim() || undefined,
        gender,
      },
      destination: selectedRoute.destination,
      baseFarePerSeat: selectedRoute.fare,
      totalDiscount,
    });

    setName("");
    setCnic("");
    setPhone("");
    setGender("male");
    setSelectedRouteId("");
    setDiscount("0");
    onClose();
  };

  const formatCnic = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    // Format as XXXXX-XXXXXXX-X
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(
      12,
      13
    )}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {selectedSeats.length > 1 ? (
              <div className="space-y-3">
                <div>Book {selectedSeats.length} Seats</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-normal text-muted-foreground">
                    Seats:
                  </span>
                  {selectedSeats.map((s) => (
                    <Badge
                      key={s.id}
                      className="px-2.5 py-1 text-sm font-bold bg-orange-500 text-white"
                    >
                      {s.id}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">{seat?.id}</span>
                </div>
                {editMode ? `Edit Seat #${seat?.id}` : `Book Seat #${seat?.id}`}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {availableRoutes.length === 0 ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No Routes Available</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                No routes have been configured from {origin}. Please add routes
                first to enable bookings.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Link href="/routes">
                <Button>Go to Routes</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {/* Destination Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Destination (from {origin})
                </Label>
                <Select
                  value={selectedRouteId}
                  onValueChange={setSelectedRouteId}
                  required
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoutes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.destination} — Rs. {route.fare.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Passenger Info */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 text-base"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  Passenger Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter full name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label
                  htmlFor="cnic"
                  className="flex items-center gap-2 text-base"
                >
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  CNIC Number
                </Label>
                <Input
                  id="cnic"
                  placeholder="XXXXX-XXXXXXX-X (optional)"
                  value={cnic}
                  onChange={(e) => setCnic(formatCnic(e.target.value))}
                  className="h-12 text-lg font-mono"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="flex items-center gap-2 text-base"
                >
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="03XX-XXXXXXX (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base">
                <Users className="w-4 h-4 text-muted-foreground" />
                Gender
              </Label>
              <RadioGroup
                value={gender}
                onValueChange={(v) => setGender(v as "male" | "female")}
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
                    <span className="text-xl">👨</span>
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
                    <span className="text-xl">👩</span>
                    <span className="font-medium">Female</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Fare Summary */}
            {selectedRoute && (
              <div className="p-4 bg-primary/5 rounded-xl space-y-2">
                {selectedSeats.length > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {seatCount} seats × Rs. {baseFarePerSeat.toLocaleString()}
                    </span>
                    <span className="font-medium">
                      Rs. {totalBaseFare.toLocaleString()}
                    </span>
                  </div>
                )}
                {selectedSeats.length <= 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Fare:</span>
                    <span>Rs. {baseFarePerSeat.toLocaleString()}</span>
                  </div>
                )}
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Total Discount:</span>
                    <span>Rs. {totalDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Final Total:</span>
                  <span className="text-primary">
                    Rs. {finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Discount */}
            <div className="space-y-2">
              <Label
                htmlFor="discount"
                className="flex items-center gap-2 text-base"
              >
                <Percent className="w-4 h-4 text-muted-foreground" />
                Total Discount (Rs.)
              </Label>
              <Input
                id="discount"
                type="number"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="h-12"
                min="0"
                max={totalBaseFare}
              />
              <p className="text-xs text-muted-foreground">
                Applies to total fare
                {selectedSeats.length > 1 ? " for all seats" : ""}
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-12 px-8"
                disabled={!selectedRoute}
              >
                {editMode ? "Save Changes" : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
