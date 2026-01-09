import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VehicleCard } from '@/components/VehicleCard';
import { AddVehicleDialog } from '@/components/AddVehicleDialog';
import { AppHeader } from '@/components/AppHeader';
import { useBookingStore } from '@/store/bookingStore';
import { Plus } from 'lucide-react';

export default function VehiclesPage() {
  const { vehicles, addVehicle, removeVehicle } = useBookingStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="My Vehicles"
        subtitle="Manage your fleet"
        backTo="/"
        actions={
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Button>
        }
      />

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {vehicles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Vehicles Yet</h2>
            <p className="text-muted-foreground mb-6">Add your first vehicle to get started</p>
            <Button onClick={() => setShowAddDialog(true)} size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Vehicle
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onDelete={() => removeVehicle(vehicle.id)}
                onClick={() => setExpandedVehicle(
                  expandedVehicle === vehicle.id ? null : vehicle.id
                )}
                showSeats={expandedVehicle === vehicle.id}
              />
            ))}
          </div>
        )}
      </main>

      <AddVehicleDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={addVehicle}
      />
    </div>
  );
}
