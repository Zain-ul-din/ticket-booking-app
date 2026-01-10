import { BookingTicket, Vehicle } from '../types/booking';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TicketCard } from './TicketCard';
import { Ticket } from 'lucide-react';

interface TicketsSectionProps {
  tickets: BookingTicket[];
  vehicle: Vehicle;
  onEditTicket: (ticket: BookingTicket) => void;
  onCancelTicket: (ticketId: string) => void;
  onPrintTicket: (ticket: BookingTicket) => void;
  canEdit: boolean;
}

export function TicketsSection({
  tickets,
  vehicle,
  onEditTicket,
  onCancelTicket,
  onPrintTicket,
  canEdit
}: TicketsSectionProps) {
  // Sort tickets by creation time (recent first)
  const sortedTickets = [...tickets].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (tickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5" />
            Tickets (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Ticket className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No tickets booked yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Select seats from the map above to create a booking
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="w-5 h-5" />
          Tickets ({tickets.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            vehicle={vehicle}
            onEdit={() => onEditTicket(ticket)}
            onCancel={() => onCancelTicket(ticket.id)}
            onPrint={() => onPrintTicket(ticket)}
            canEdit={canEdit}
          />
        ))}
      </CardContent>
    </Card>
  );
}
