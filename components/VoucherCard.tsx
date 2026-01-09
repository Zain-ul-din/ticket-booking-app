import { Voucher, Vehicle } from '../types/booking';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bus, Car, Clock, MapPin, Phone, User, Trash2, ChevronRight } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface VoucherCardProps {
  voucher: Voucher;
  vehicle: Vehicle | undefined;
  onDelete?: () => void;
  onClick?: () => void;
}

export function VoucherCard({ voucher, vehicle, onDelete, onClick }: VoucherCardProps) {
  const bookedCount = voucher.bookedSeats.length;
  const totalSeats = vehicle?.totalSeats || 0;
  const Icon = vehicle?.type === 'bus' ? Bus : Car;

  return (
    <Card
      className={`overflow-hidden transition-all ${onClick ? 'cursor-pointer hover:border-primary hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-lg">{vehicle?.name || 'Unknown Vehicle'}</div>
              <p className="text-sm text-muted-foreground font-mono">
                {vehicle?.registrationNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={bookedCount === totalSeats ? 'default' : 'secondary'}>
              {bookedCount}/{totalSeats} Booked
            </Badge>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium">From: {voucher.origin}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{voucher.departureTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span>{voucher.driverName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono">{voucher.driverMobile}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {formatDate(new Date(voucher.date))}
          </span>
          {onClick && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </CardContent>
    </Card>
  );
}
