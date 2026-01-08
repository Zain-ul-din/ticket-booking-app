import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../components/ui/button';
import { VoucherCard } from '../components/VoucherCard';
import { CreateVoucherDialog } from '../components/CreateVoucherDialog';
import { useBooking } from '../contexts/BookingContext';
import { Plus, ArrowLeft, FileText } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export default function VouchersPage() {
  const router = useRouter();
  const { vouchers, vehicles, removeVoucher, getVehicleById } = useBooking();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Group vouchers by date
  const groupedVouchers = vouchers.reduce((acc, voucher) => {
    const date = voucher.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(voucher);
    return acc;
  }, {} as Record<string, typeof vouchers>);

  const sortedDates = Object.keys(groupedVouchers).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Daily Vouchers</h1>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2"
            disabled={vehicles.length === 0}
          >
            <Plus className="w-4 h-4" />
            Create Voucher
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {vehicles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Add Vehicles First</h2>
            <p className="text-muted-foreground mb-6">You need to add vehicles before creating vouchers</p>
            <Link href="/vehicles">
              <Button size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Go to Vehicles
              </Button>
            </Link>
          </div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Vouchers Yet</h2>
            <p className="text-muted-foreground mb-6">Create your first daily voucher to start booking seats</p>
            <Button onClick={() => setShowCreateDialog(true)} size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Voucher
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((date) => (
              <div key={date}>
                <h2 className="text-lg font-semibold text-muted-foreground mb-4">
                  {formatDate(new Date(date))}
                </h2>
                <div className="grid gap-4">
                  {groupedVouchers[date].map((voucher) => (
                    <VoucherCard
                      key={voucher.id}
                      voucher={voucher}
                      vehicle={getVehicleById(voucher.vehicleId)}
                      onDelete={() => removeVoucher(voucher.id)}
                      onClick={() => router.push(`/booking/${voucher.id}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CreateVoucherDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </div>
  );
}
