import Link from "next/link";
import { useBooking } from "../contexts/BookingContext";
import { Bus, FileText, Ticket, ChevronRight, Route, Home } from "lucide-react";
import { formatDate } from "../utils/dateUtils";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const { vehicles, vouchers, routes, getVehicleById } = useBooking();

  // Get today's vouchers
  const today = new Date().toISOString().split("T")[0];
  const todayVouchers = vouchers.filter((v) => v.date === today);

  // Get total bookings for today
  const totalBookingsToday = todayVouchers.reduce(
    (acc, v) => acc + v.bookedSeats.length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
              <Bus className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Booking Manager</h1>
              <p className="text-muted-foreground">
                Manage your vehicles and seat bookings
              </p>
            </div>
            <Link href={"/"} className="ml-auto">
              <Button className="ml-auto" variant={"outline"}>
                <Home />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="section-card text-center">
            <div className="text-3xl font-bold text-primary">
              {vehicles.length}
            </div>
            <div className="text-sm text-muted-foreground">Vehicles</div>
          </div>
          <div className="section-card text-center">
            <div className="text-3xl font-bold text-primary">
              {routes.length}
            </div>
            <div className="text-sm text-muted-foreground">Routes</div>
          </div>
          <div className="section-card text-center">
            <div className="text-3xl font-bold text-primary">
              {todayVouchers.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {`Today's`} Trips
            </div>
          </div>
          <div className="section-card text-center">
            <div className="text-3xl font-bold text-primary">
              {totalBookingsToday}
            </div>
            <div className="text-sm text-muted-foreground">Bookings Today</div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Link href="/vehicles" className="nav-button">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bus className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Vehicles</h2>
              <p className="text-sm text-muted-foreground">Manage fleet</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <Link href="/routes" className="nav-button">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Route className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Routes & Fares</h2>
              <p className="text-sm text-muted-foreground">Set prices</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <Link href="/vouchers" className="nav-button">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Vouchers</h2>
              <p className="text-sm text-muted-foreground">Create trips</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>

        {/* Today's Trips */}
        {todayVouchers.length > 0 && (
          <div className="section-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{`Today's`} Trips</h2>
              <span className="text-sm text-muted-foreground">
                {formatDate(new Date())}
              </span>
            </div>
            <div className="space-y-3">
              {todayVouchers.map((voucher) => {
                const vehicle = getVehicleById(voucher.vehicleId);
                const bookedCount = voucher.bookedSeats.length;
                const totalSeats = vehicle?.totalSeats || 0;

                return (
                  <Link
                    key={voucher.id}
                    href={`/booking/${voucher.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">From: {voucher.origin}</div>
                      <div className="text-sm text-muted-foreground">
                        {voucher.departureTime} • {vehicle?.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        {bookedCount}/{totalSeats}
                      </div>
                      <div className="text-xs text-muted-foreground">seats</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State for Today */}
        {todayVouchers.length === 0 && vouchers.length > 0 && (
          <div className="section-card text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Ticket className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No Trips Today</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a new voucher to start booking seats
            </p>
            <Link
              href="/vouchers"
              className="text-primary font-medium hover:underline"
            >
              Go to Vouchers →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
