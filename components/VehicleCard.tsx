import { Vehicle } from '../types/booking';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Bus, Car, Trash2, Users } from 'lucide-react';
import { SeatMap } from './SeatMap';

interface VehicleCardProps {
  vehicle: Vehicle;
  onDelete?: () => void;
  onClick?: () => void;
  showSeats?: boolean;
}

export function VehicleCard({ vehicle, onDelete, onClick, showSeats = false }: VehicleCardProps) {
  const Icon = vehicle.type === 'bus' ? Bus : Car;

  return (
    <Card
      className={`overflow-hidden transition-all ${onClick ? 'cursor-pointer hover:border-primary hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{vehicle.name}</CardTitle>
              <p className="text-sm text-muted-foreground font-mono mt-0.5">
                {vehicle.registrationNumber}
              </p>
            </div>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete ${vehicle.name}?`)) {
                  onDelete();
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Users className="w-4 h-4" />
          <span>{vehicle.totalSeats} seats</span>
          <span className="text-muted">•</span>
          <span className="capitalize">{vehicle.type === 'highroof' ? 'High Roof' : 'Bus'}</span>
        </div>

        {showSeats && (
          <div className="mt-4 p-4 bg-muted/30 rounded-xl">
            <SeatMap seats={vehicle.seats} readOnly compact />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
