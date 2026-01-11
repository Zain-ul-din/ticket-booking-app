import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { VoucherCard } from "../components/VoucherCard";
import { CreateVoucherDialog } from "../components/CreateVoucherDialog";
import { EditVoucherDialog } from "../components/EditVoucherDialog";
import { DepartureSummaryDialog } from "../components/DepartureSummaryDialog";
import { useBooking } from "../contexts/BookingContext";
import { Plus, ArrowLeft, FileText } from "lucide-react";
import { formatDateFull } from "../utils/dateUtils";
import { Voucher } from "../types/booking";

export default function VouchersPage() {
  const router = useRouter();
  const { vouchers, vehicles, removeVoucher, updateVoucher, getVehicleById } =
    useBooking();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedVoucherForEdit, setSelectedVoucherForEdit] = useState<Voucher | null>(null);
  const [departureDialogOpen, setDepartureDialogOpen] = useState(false);
  const [selectedVoucherForDeparture, setSelectedVoucherForDeparture] =
    useState<Voucher | null>(null);
  const [activeTab, setActiveTab] = useState("active");

  // Filter vouchers by status
  const activeVouchers = vouchers.filter(
    (v) => !v.status || v.status === "boarding"
  );
  const departedVouchers = vouchers.filter(
    (v) => v.status === "departed" || v.status === "closed"
  );

  // Group vouchers by date based on active tab
  const currentVouchers = activeTab === "active" ? activeVouchers : departedVouchers;

  const groupedVouchers = currentVouchers.reduce((acc, voucher) => {
    const date = voucher.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(voucher);
    return acc;
  }, {} as Record<string, typeof currentVouchers>);

  const sortedDates = Object.keys(groupedVouchers).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const handleMarkDeparted = (voucher: Voucher) => {
    setSelectedVoucherForDeparture(voucher);
    setDepartureDialogOpen(true);
  };

  const handleConfirmDeparture = (terminalTax: number, cargo: number) => {
    if (!selectedVoucherForDeparture) return;

    updateVoucher(selectedVoucherForDeparture.id, {
      status: "departed",
      terminalTax,
      cargo,
      departedAt: new Date().toISOString(),
    });

    setDepartureDialogOpen(false);
    setSelectedVoucherForDeparture(null);
  };

  const handleMarkClosed = (voucherId: string) => {
    if (confirm("Mark this voucher as closed? This action cannot be undone.")) {
      updateVoucher(voucherId, {
        status: "closed",
        closedAt: new Date().toISOString(),
      });
    }
  };

  const handleEditVoucher = (voucher: Voucher) => {
    setSelectedVoucherForEdit(voucher);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (voucherId: string, updates: Partial<Voucher>) => {
    updateVoucher(voucherId, updates);
    setShowEditDialog(false);
    setSelectedVoucherForEdit(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/manage">
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
            <p className="text-muted-foreground mb-6">
              You need to add vehicles before creating vouchers
            </p>
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
            <p className="text-muted-foreground mb-6">
              Create your first daily voucher to start booking seats
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              size="lg"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Voucher
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="departed">Departed</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="active">
              {currentVouchers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No Active Vouchers</h2>
                  <p className="text-muted-foreground">
                    All vouchers have been marked as departed or closed
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortedDates.map((date) => (
                    <div key={date}>
                      <h2 className="text-lg font-semibold text-muted-foreground mb-4">
                        {formatDateFull(new Date(date))}
                      </h2>
                      <div className="grid gap-4">
                        {groupedVouchers[date].map((voucher) => (
                          <VoucherCard
                            key={voucher.id}
                            voucher={voucher}
                            vehicle={getVehicleById(voucher.vehicleId)}
                            onEdit={() => handleEditVoucher(voucher)}
                            onDelete={() => removeVoucher(voucher.id)}
                            onClick={() => router.push(`/booking/${voucher.id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="departed">
              {currentVouchers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No Departed Vouchers</h2>
                  <p className="text-muted-foreground">
                    No vouchers have been marked as departed or closed yet
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortedDates.map((date) => (
                    <div key={date}>
                      <h2 className="text-lg font-semibold text-muted-foreground mb-4">
                        {formatDateFull(new Date(date))}
                      </h2>
                      <div className="grid gap-4">
                        {groupedVouchers[date].map((voucher) => (
                          <VoucherCard
                            key={voucher.id}
                            voucher={voucher}
                            vehicle={getVehicleById(voucher.vehicleId)}
                            onClick={() => router.push(`/booking/${voucher.id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
      {/* 
      {}
      <DepartureSummaryDialog
        open={departureDialogOpen}
        onClose={() => {
          setDepartureDialogOpen(false);
          setSelectedVoucherForDeparture(null);
        }}
        voucher={selectedVoucherForDeparture!}
        vehicle={
          selectedVoucherForDeparture
            ? getVehicleById(selectedVoucherForDeparture.vehicleId)
            : undefined
        }
        onConfirm={handleConfirmDeparture}
      /> */}

      <CreateVoucherDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />

      <EditVoucherDialog
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedVoucherForEdit(null);
        }}
        voucher={selectedVoucherForEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
