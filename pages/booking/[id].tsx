import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { SeatMap } from "../../components/SeatMap";
import { BookingDialog } from "../../components/BookingDialog";
import { CancelBookingDialog } from "../../components/CancelBookingDialog";
import { useBooking } from "../../contexts/BookingContext";
import { Seat, Passenger, BookedSeat } from "../../types/booking";
import { ArrowLeft, Printer, MapPin, Clock, User, Phone } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

export default function BookingPage() {
  const router = useRouter();
  const { id } = router.query;
  const { getVoucherById, getVehicleById, updateVoucher } = useBooking();

  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<BookedSeat | null>(
    null
  );
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const voucher = id ? getVoucherById(id as string) : null;
  const vehicle = voucher ? getVehicleById(voucher.vehicleId) : null;

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const handleSeatClick = (seat: Seat) => {
    if (seat.type === "driver") return;

    // Check if seat is already booked
    const existingBooking = voucher?.bookedSeats.find(
      (bs) => bs.seatId === seat.id
    );

    if (existingBooking) {
      // Open cancel dialog
      setBookingToCancel(existingBooking);
      setShowCancelDialog(true);
    } else {
      // Open booking dialog
      setSelectedSeat(seat);
      setShowBookingDialog(true);
    }
  };

  const handleBookSeat = (passenger: Passenger) => {
    if (!voucher || !selectedSeat) return;

    const newBooking: BookedSeat = {
      seatId: selectedSeat.id,
      passenger,
    };

    const updatedVoucher = {
      ...voucher,
      bookedSeats: [...voucher.bookedSeats, newBooking],
    };

    updateVoucher(updatedVoucher);
    setShowBookingDialog(false);
    setSelectedSeat(null);
  };

  const handleCancelBooking = () => {
    if (!voucher || !bookingToCancel) return;

    const updatedVoucher = {
      ...voucher,
      bookedSeats: voucher.bookedSeats.filter(
        (bs) => bs.seatId !== bookingToCancel.seatId
      ),
    };

    updateVoucher(updatedVoucher);
    setShowCancelDialog(false);
    setBookingToCancel(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // Not found state
  if (!voucher || !vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Voucher Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The voucher {`you're looking for doesn't`} exist.
          </p>
          <Link href="/vouchers">
            <Button>Go to Vouchers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const bookedSeatsCount = voucher.bookedSeats.length;
  const totalSeats = vehicle.seats.filter((s) => s.type !== "driver").length;
  const availableSeats = totalSeats - bookedSeatsCount;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 print:hidden">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/vouchers">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Seat Booking</h1>
              <p className="text-sm text-muted-foreground">
                Click on a seat to book it
              </p>
            </div>
          </div>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Voucher Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Vehicle Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                      {vehicle.icon}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{vehicle.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.registrationNumber}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Destination
                        </p>
                        <p className="font-medium">{voucher.destination}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Departure
                        </p>
                        <p className="font-medium">
                          {formatDate(new Date(voucher.date))} at{" "}
                          {voucher.departureTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">Driver</p>
                        <p className="font-medium">{voucher.driverName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground text-xs">Phone</p>
                        <p className="font-medium">{voucher.driverMobile}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fare</span>
                    <span className="text-xl font-bold">
                      Rs. {voucher.fare}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Booking Status
                    </span>
                    <span
                      className={
                        bookedSeatsCount > 0
                          ? "text-orange-600 font-semibold"
                          : "font-semibold"
                      }
                    >
                      {bookedSeatsCount}/{totalSeats} Seats
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passengers List */}
            {voucher.bookedSeats.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">
                    Booked Passengers ({bookedSeatsCount})
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {voucher.bookedSeats.map((booking) => {
                      const genderEmoji =
                        booking.passenger.gender === "male" ? "👨" : "👩";
                      return (
                        <div
                          key={booking.seatId}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                            {booking.seatId}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{genderEmoji}</span>
                              <p className="font-medium truncate">
                                {booking.passenger.name}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground font-mono">
                              {booking.passenger.cnic}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content - Seat Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold">Select a Seat to Book</h2>
                </div>
                <SeatMap
                  seats={vehicle.seats}
                  bookedSeats={voucher.bookedSeats}
                  onSeatClick={handleSeatClick}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Booking Dialog */}
      <BookingDialog
        open={showBookingDialog}
        onClose={() => {
          setShowBookingDialog(false);
          setSelectedSeat(null);
        }}
        seat={selectedSeat}
        onBook={handleBookSeat}
      />

      {/* Cancel Booking Dialog */}
      <CancelBookingDialog
        open={showCancelDialog}
        onClose={() => {
          setShowCancelDialog(false);
          setBookingToCancel(null);
        }}
        booking={bookingToCancel}
        onConfirm={handleCancelBooking}
      />
    </div>
  );
}
