import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { SeatMap } from "../../components/SeatMap";
import { BookingDialog } from "../../components/BookingDialog";
import { CancelBookingDialog } from "../../components/CancelBookingDialog";
import { SelectedSeatsTray } from "../../components/SelectedSeatsTray";
import { BulkBookingDialog } from "../../components/BulkBookingDialog";
import { VoucherStateBadge } from "../../components/VoucherStateBadge";
import { VoucherStateActions } from "../../components/VoucherStateActions";
import { DepartureSummaryDialog } from "../../components/DepartureSummaryDialog";
import { useBooking } from "../../contexts/BookingContext";
import { getVoucherStatus, canEditVoucher } from "../../utils/voucherUtils";
import { Seat, Passenger, BookedSeat } from "../../types/booking";
import { ArrowLeft, Printer, MapPin, Clock, User, Phone, Bus, Car } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

export default function BookingPage() {
  const router = useRouter();
  const { id } = router.query;
  const { getVoucherById, getVehicleById, updateVoucher, routes, getRoutesByOrigin } = useBooking();

  const voucher = id ? getVoucherById(id as string) : null;
  const vehicle = voucher ? getVehicleById(voucher.vehicleId) : null;

  // Filter routes by origin AND vehicle type
  const availableRoutes = voucher && vehicle
    ? getRoutesByOrigin(voucher.origin).filter(route => route.vehicleType === vehicle.type)
    : [];

  // Booking state
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookedSeat | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Multi-seat selection state
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [showBulkDialog, setShowBulkDialog] = useState(false);

  // Voucher state management
  const [showDepartureDialog, setShowDepartureDialog] = useState(false);

  // Check if bookings can be edited based on voucher status
  const canEdit = voucher ? canEditVoucher(voucher) : true;

  if (!voucher || !vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Voucher Not Found</h2>
          <p className="text-muted-foreground mb-4">This voucher may have been deleted</p>
          <Link href="/vouchers">
            <Button>Go to Vouchers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = vehicle.type === 'bus' ? Bus : Car;
  const bookedCount = voucher.bookedSeats.length;

  const handleSeatClick = (seat: Seat) => {
    // Prevent modifications if voucher is not in boarding state
    if (!canEdit) return;

    // Check if already booked
    const existingBooking = voucher.bookedSeats.find(bs => bs.seatId === seat.id);

    if (existingBooking) {
      // Show cancel dialog for booked seats
      setSelectedBooking(existingBooking);
      setShowCancelDialog(true);
      return;
    }

    // Toggle seat selection
    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleBookSelectedSeats = () => {
    if (selectedSeats.length === 0) return;

    // Use first seat as reference, will apply same details to all
    setSelectedSeat(selectedSeats[0]);
    setShowBookingDialog(true);
  };

  const handleClearSelectedSeats = () => {
    setSelectedSeats([]);
  };

  const handleCancelBulkBooking = () => {
    setShowBulkDialog(false);
    setSelectedSeats([]);
  };

  const handleBulkBook = (destination: string, fare: number) => {
    // TODO: Add passenger details collection
    // For now, just create bookings with placeholder data
    const newBookings = selectedSeats.map(seat => ({
      seatId: seat.id,
      destination,
      fare,
      discount: 0,
      finalFare: fare,
      passenger: {
        name: 'Passenger ' + seat.id, // Placeholder
        cnic: '00000-0000000-0', // Placeholder
        gender: 'male' as const,
      },
    }));

    updateVoucher(voucher.id, {
      bookedSeats: [...voucher.bookedSeats, ...newBookings],
    });

    setShowBulkDialog(false);
    setSelectedSeats([]);
  };

  const handleBookSeat = (booking: Omit<BookedSeat, 'seatId'>) => {
    if (editMode && selectedBooking) {
      // Update existing booking
      updateVoucher(voucher.id, {
        bookedSeats: voucher.bookedSeats.map(bs =>
          bs.seatId === selectedBooking.seatId
            ? { ...bs, ...booking }
            : bs
        )
      });
      setEditMode(false);
      setSelectedBooking(null);
    } else if (selectedSeats.length > 0) {
      // Multiple seats: apply same details to all
      const newBookings = selectedSeats.map(seat => ({
        seatId: seat.id,
        ...booking
      }));

      updateVoucher(voucher.id, {
        bookedSeats: [
          ...voucher.bookedSeats,
          ...newBookings
        ]
      });
    } else if (selectedSeat) {
      // Single seat (fallback)
      updateVoucher(voucher.id, {
        bookedSeats: [
          ...voucher.bookedSeats,
          { seatId: selectedSeat.id, ...booking }
        ]
      });
    }
    setShowBookingDialog(false);
    setSelectedSeat(null);
    setSelectedSeats([]); // Clear selection to hide tray
  };

  const handleCancelBooking = () => {
    if (!selectedBooking) return;

    updateVoucher(voucher.id, {
      bookedSeats: voucher.bookedSeats.filter(
        bs => bs.seatId !== selectedBooking.seatId
      )
    });
    setShowCancelDialog(false);
    setSelectedBooking(null);
  };

  const handleEditBooking = () => {
    if (!selectedBooking) return;

    const seat = vehicle.seats.find(s => s.id === selectedBooking.seatId);
    if (seat) {
      setSelectedSeat(seat);
      setEditMode(true);
      setShowCancelDialog(false);
      setShowBookingDialog(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMarkDeparted = () => {
    setShowDepartureDialog(true);
  };

  const handleConfirmDeparture = (terminalTax: number, cargo: number) => {
    updateVoucher(voucher.id, {
      status: 'departed',
      terminalTax,
      cargo,
      departedAt: new Date().toISOString()
    });
    setShowDepartureDialog(false);
  };

  const handleMarkClosed = () => {
    if (confirm('Mark this voucher as closed? This action cannot be undone.')) {
      updateVoucher(voucher.id, {
        status: 'closed',
        closedAt: new Date().toISOString()
      });
    }
  };

  const totalSeats = vehicle.seats.filter((s) => !s.isDriver).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 print:hidden">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/vouchers">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Seat Booking</h1>
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

      <main className="container max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Voucher Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Vehicle Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
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
                          Starting From
                        </p>
                        <p className="font-medium">{voucher.origin}</p>
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

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Booking Status
                    </span>
                    <Badge variant={bookedCount === totalSeats ? 'default' : 'secondary'}>
                      {bookedCount}/{totalSeats} Seats
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Voucher Status
                    </span>
                    <VoucherStateBadge status={getVoucherStatus(voucher)} size="md" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voucher State Actions */}
            <VoucherStateActions
              voucher={voucher}
              onMarkDeparted={handleMarkDeparted}
              onMarkClosed={handleMarkClosed}
              variant="full"
            />

            {/* Warning for non-boarding status */}
            {!canEdit && (
              <div className="p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
                <p className="text-sm text-orange-900 dark:text-orange-100 font-medium">
                  This voucher has {getVoucherStatus(voucher)}. Bookings cannot be modified.
                </p>
              </div>
            )}

            {/* Passengers List */}
            {voucher.bookedSeats.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Passengers</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {voucher.bookedSeats.map((booking) => {
                      const genderEmoji =
                        booking.passenger.gender === "male" ? "👨" : "👩";
                      return (
                        <div
                          key={booking.seatId}
                          className="p-3 rounded-lg bg-muted/30 space-y-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                              {booking.seatId}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {booking.passenger.name}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {booking.passenger.cnic}
                              </p>
                            </div>
                            <span className="text-xl">{genderEmoji}</span>
                          </div>
                          <div className="pl-11 space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-muted-foreground">To:</span>
                              <span className="font-medium">{booking.destination}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                Fare: Rs. {booking.fare.toLocaleString()}
                                {booking.discount > 0 && ` - ${booking.discount.toLocaleString()}`}
                              </span>
                              <span className="font-semibold text-primary">
                                Rs. {booking.finalFare.toLocaleString()}
                              </span>
                            </div>
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
                  <h2 className="text-xl font-bold text-center">
                    Select Seats to Book
                  </h2>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Click on seats to select them. Selected seats will appear in the tray below.
                  </p>
                </div>
                <div className="flex justify-center">
                  <SeatMap
                    seats={vehicle.seats}
                    bookedSeats={voucher.bookedSeats}
                    onSeatClick={handleSeatClick}
                    selectedSeats={selectedSeats}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Selected Seats Tray */}
      <SelectedSeatsTray
        selectedSeats={selectedSeats}
        onClearAll={handleClearSelectedSeats}
        onBook={handleBookSelectedSeats}
      />

      {/* Booking Dialog */}
      <BookingDialog
        open={showBookingDialog}
        onClose={() => {
          setShowBookingDialog(false);
          setSelectedSeat(null);
          setEditMode(false);
          setSelectedBooking(null);
        }}
        seat={selectedSeat}
        onBook={handleBookSeat}
        editMode={editMode}
        existingBooking={selectedBooking}
        availableRoutes={availableRoutes}
        origin={voucher?.origin || ''}
        selectedSeats={selectedSeats}
      />

      {/* Cancel Booking Dialog */}
      <CancelBookingDialog
        open={showCancelDialog}
        onClose={() => {
          setShowCancelDialog(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onCancel={handleCancelBooking}
        onEdit={handleEditBooking}
      />

      {/* Bulk Booking Dialog */}
      <BulkBookingDialog
        open={showBulkDialog}
        onClose={handleCancelBulkBooking}
        seats={selectedSeats}
        availableRoutes={availableRoutes}
        origin={voucher?.origin || ''}
        onBook={handleBulkBook}
      />

      {/* Departure Summary Dialog */}
      <DepartureSummaryDialog
        open={showDepartureDialog}
        onClose={() => setShowDepartureDialog(false)}
        voucher={voucher}
        vehicle={vehicle}
        onConfirm={handleConfirmDeparture}
      />
    </div>
  );
}
