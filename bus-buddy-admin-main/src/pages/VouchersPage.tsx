import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VoucherCard } from '@/components/VoucherCard';
import { CreateVoucherDialog } from '@/components/CreateVoucherDialog';
import { AppHeader } from '@/components/AppHeader';
import { useBookingStore } from '@/store/bookingStore';
import { Plus, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function VouchersPage() {
  const navigate = useNavigate();
  const { vouchers, vehicles, removeVoucher, getVehicleById } = useBookingStore();
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
      <AppHeader
        title="Daily Vouchers"
        subtitle="Manage trip vouchers"
        backTo="/"
        actions={
          <Button 
            onClick={() => setShowCreateDialog(true)} 
            className="gap-2"
            disabled={vehicles.length === 0}
          >
            <Plus className="w-4 h-4" />
            Create Voucher
          </Button>
        }
      />

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {vehicles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Add Vehicles First</h2>
            <p className="text-muted-foreground mb-6">You need to add vehicles before creating vouchers</p>
            <Link to="/vehicles">
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
                  {format(new Date(date), 'EEEE, dd MMMM yyyy')}
                </h2>
                <div className="grid gap-4">
                  {groupedVouchers[date].map((voucher) => (
                    <VoucherCard
                      key={voucher.id}
                      voucher={voucher}
                      vehicle={getVehicleById(voucher.vehicleId)}
                      onDelete={() => removeVoucher(voucher.id)}
                      onClick={() => navigate(`/booking/${voucher.id}`)}
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
