import { Voucher } from '../types/booking';
import { Button } from './ui/button';
import { getVoucherStatus } from '../utils/voucherUtils';
import { Flag, LockKeyhole } from 'lucide-react';
import { cn } from '../lib/utils';

interface VoucherStateActionsProps {
  voucher: Voucher;
  onMarkDeparted: () => void;
  onMarkClosed: () => void;
  variant?: 'compact' | 'full';
}

export function VoucherStateActions({
  voucher,
  onMarkDeparted,
  onMarkClosed,
  variant = 'full',
}: VoucherStateActionsProps) {
  const status = getVoucherStatus(voucher);

  // No actions for closed vouchers
  if (status === 'closed') {
    return null;
  }

  const isCompact = variant === 'compact';

  // Boarding state: Show "Mark as Departed" button
  if (status === 'boarding') {
    if (isCompact) {
      return (
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onMarkDeparted();
          }}
          className="gap-1"
        >
          <Flag className="w-3 h-3" />
          Depart
        </Button>
      );
    }

    return (
      <Button
        variant="destructive"
        onClick={onMarkDeparted}
        className="w-full gap-2 h-12"
      >
        <Flag className="w-5 h-5" />
        Mark as Departed
      </Button>
    );
  }

  // Departed state: Show "Mark as Closed" button
  if (status === 'departed') {
    if (isCompact) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onMarkClosed();
          }}
          className="gap-1"
        >
          <LockKeyhole className="w-3 h-3" />
          Close
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        onClick={onMarkClosed}
        className="w-full gap-2 h-12"
      >
        <LockKeyhole className="w-5 h-5" />
        Mark as Closed
      </Button>
    );
  }

  return null;
}
