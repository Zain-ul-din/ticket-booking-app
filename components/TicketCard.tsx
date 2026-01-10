import { BookingTicket, Vehicle } from '../types/booking';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, MapPin, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface TicketCardProps {
  ticket: BookingTicket;
  vehicle: Vehicle;
  onEdit: () => void;
  onCancel: () => void;
  canEdit: boolean;
}

export function TicketCard({ ticket, vehicle, onEdit, onCancel, canEdit }: TicketCardProps) {
  const genderIcon = ticket.passenger.gender === 'male' ? '👨' : '👩';
  const seatDisplay = ticket.seatIds.length === 1
    ? `Seat ${ticket.seatIds[0]}`
    : `Seats ${ticket.seatIds.join(', ')}`;

  return (
    <Card className={cn("overflow-hidden", !canEdit && "opacity-70")}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header: Passenger & Actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{genderIcon}</div>
              <div>
                <h3 className="font-semibold text-lg">{ticket.passenger.name}</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {ticket.passenger.cnic}
                </p>
              </div>
            </div>

            {canEdit && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                  }}
                  className="text-destructive hover:text-destructive gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Seats & Destination */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium">{seatDisplay}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">To: {ticket.destination}</span>
            </div>
          </div>

          {/* Fare Breakdown */}
          <div className="p-3 bg-muted/30 rounded-lg space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {ticket.seatIds.length} seat{ticket.seatIds.length > 1 ? 's' : ''} × Rs. {ticket.baseFarePerSeat.toLocaleString()}
              </span>
              <span className="font-medium">Rs. {ticket.totalBaseFare.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>
              <span className="font-medium">- Rs. {ticket.totalDiscount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1.5 border-t">
              <span>Final Total:</span>
              <span className="text-primary">Rs. {ticket.finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
