import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SeatMap } from '@/components/SeatMap';
import { BookingDialog } from '@/components/BookingDialog';
import { CancelBookingDialog } from '@/components/CancelBookingDialog';
import { AppHeader } from '@/components/AppHeader';
import { useBookingStore } from '@/store/bookingStore';
import { SeatConfig, BookedSeat } from '@/types/booking';
import { Bus, Car, Clock, MapPin, Phone, User, Printer, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function BookingPage() {
  const { voucherId } = useParams<{ voucherId: string }>();
  const { getVoucherById, getVehicleById, getRoutesByOrigin, updateVoucher } = useBookingStore();
  
  const voucher = getVoucherById(voucherId || '');
  const vehicle = voucher ? getVehicleById(voucher.vehicleId) : undefined;
  const availableRoutes = voucher ? getRoutesByOrigin(voucher.origin) : [];
  
  const [selectedSeat, setSelectedSeat] = useState<SeatConfig | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookedSeat | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!voucher || !vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Voucher Not Found</h2>
          <p className="text-muted-foreground mb-4">This voucher may have been deleted</p>
          <Link to="/vouchers">
            <Button>Go to Vouchers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = vehicle.type === 'bus' ? Bus : Car;
  const bookedCount = voucher.bookedSeats.length;
  
  // Calculate total revenue
  const totalRevenue = voucher.bookedSeats.reduce((acc, bs) => acc + bs.finalFare, 0);

  // Filter passengers by search
  const filteredPassengers = voucher.bookedSeats.filter(bs => 
    bs.passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bs.passenger.cnic.includes(searchQuery)
  );

  const handleSeatClick = (seat: SeatConfig) => {
    const existingBooking = voucher.bookedSeats.find(bs => bs.seatId === seat.id);
    
    if (existingBooking) {
      setSelectedBooking(existingBooking);
      setShowCancelDialog(true);
      return;
    }
    
    setSelectedSeat(seat);
    setShowBookingDialog(true);
  };

  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    
    updateVoucher(voucher.id, {
      bookedSeats: voucher.bookedSeats.filter(bs => bs.seatId !== selectedBooking.seatId)
    });
    
    setShowCancelDialog(false);
    setSelectedBooking(null);
  };

  const handleBook = (bookingData: Omit<BookedSeat, 'seatId'>) => {
    if (editMode && selectedBooking) {
      updateVoucher(voucher.id, {
        bookedSeats: voucher.bookedSeats.map(bs => 
          bs.seatId === selectedBooking.seatId 
            ? { ...bookingData, seatId: bs.seatId } 
            : bs
        )
      });
      setEditMode(false);
      setSelectedBooking(null);
    } else if (selectedSeat) {
      updateVoucher(voucher.id, {
        bookedSeats: [
          ...voucher.bookedSeats,
          { ...bookingData, seatId: selectedSeat.id }
        ]
      });
    }
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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Seat Booking"
        subtitle="Click on a seat to book it"
        backTo="/vouchers"
        actions={
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
        }
      />

      <main className="container max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Voucher Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="section-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{vehicle.name}</h2>
                  <p className="text-sm text-muted-foreground font-mono">
                    {vehicle.registrationNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-xs">Starting From</p>
                    <p className="font-medium">{voucher.origin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground text-xs">Departure</p>
                    <p className="font-medium">
                      {format(new Date(voucher.date), 'dd MMM yyyy')} at {voucher.departureTime}
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
                    <p className="text-muted-foreground text-xs">Mobile</p>
                    <p className="font-medium font-mono">{voucher.driverMobile}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Booking Status</span>
                  <Badge variant={bookedCount === vehicle.totalSeats ? 'default' : 'secondary'}>
                    {bookedCount}/{vehicle.totalSeats} Seats
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Collection</span>
                  <span className="font-bold text-xl text-primary">Rs. {totalRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Passenger List with Search */}
            {voucher.bookedSeats.length > 0 && (
              <div className="section-card">
                <h3 className="font-semibold mb-4">Passengers ({voucher.bookedSeats.length})</h3>
                
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or CNIC..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredPassengers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No passengers found
                    </p>
                  ) : (
                    filteredPassengers.map((bs) => (
                      <div 
                        key={bs.seatId}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {bs.seatId}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{bs.passenger.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-mono">{bs.passenger.cnic}</span>
                            <span>→ {bs.destination}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">Rs. {bs.finalFare}</p>
                          <span className="text-lg">
                            {bs.passenger.gender === 'male' ? '👨' : '👩'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="section-card">
              <h3 className="font-semibold mb-6 text-center">Select a Seat to Book</h3>
              <div className="flex justify-center">
                <SeatMap
                  seats={vehicle.seats}
                  bookedSeats={voucher.bookedSeats}
                  onSeatClick={handleSeatClick}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <BookingDialog
        open={showBookingDialog}
        onClose={() => {
          setShowBookingDialog(false);
          setSelectedSeat(null);
          setEditMode(false);
          setSelectedBooking(null);
        }}
        seat={selectedSeat}
        onBook={handleBook}
        editMode={editMode}
        existingBooking={editMode ? selectedBooking : null}
        availableRoutes={availableRoutes}
        origin={voucher.origin}
      />

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
    </div>
  );
}
