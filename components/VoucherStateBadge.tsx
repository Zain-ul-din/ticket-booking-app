import { VoucherStatus } from '../types/booking';
import { Badge } from './ui/badge';
import { getVoucherStatusDisplay } from '../utils/voucherUtils';
import { cn } from '../lib/utils';

interface VoucherStateBadgeProps {
  status: VoucherStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function VoucherStateBadge({ status, size = 'sm' }: VoucherStateBadgeProps) {
  const display = getVoucherStatusDisplay(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <Badge
      variant={display.variant}
      className={cn(
        'font-semibold',
        sizeClasses[size],
        display.bgColor
      )}
    >
      <span className="mr-1">{display.emoji}</span>
      {display.label}
    </Badge>
  );
}
