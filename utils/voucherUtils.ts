import {
  Voucher,
  VoucherStatus,
  VoucherFinancialSummary,
  DestinationRevenue,
} from '../types/booking';

/**
 * Calculate financial summary for a voucher
 * Groups bookings by destination and calculates total revenue
 *
 * @param voucher - The voucher to calculate summary for
 * @param terminalTax - Terminal tax amount (default: 0)
 * @param cargo - Cargo revenue (default: 0)
 * @returns Financial summary with breakdown by destination
 */
export function calculateVoucherFinancialSummary(
  voucher: Voucher,
  terminalTax: number = 0,
  cargo: number = 0
): VoucherFinancialSummary {
  // Group bookings by destination
  const byDestination = voucher.bookedSeats.reduce((acc, booking) => {
    const dest = booking.destination;
    if (!acc[dest]) {
      acc[dest] = { destination: dest, ticketCount: 0, totalRevenue: 0 };
    }
    acc[dest].ticketCount++;
    acc[dest].totalRevenue += booking.finalFare;
    return acc;
  }, {} as Record<string, DestinationRevenue>);

  // Convert to array and sort alphabetically
  const revenueByDestination = Object.values(byDestination)
    .sort((a, b) => a.destination.localeCompare(b.destination));

  // Calculate totals
  const totalFare = revenueByDestination.reduce((sum, r) => sum + r.totalRevenue, 0);
  const grandTotal = totalFare - terminalTax + cargo;

  return {
    revenueByDestination,
    totalFare,
    terminalTax,
    cargo,
    grandTotal
  };
}

/**
 * Get voucher status with backward compatibility
 * Returns 'boarding' as default if status is not set
 *
 * @param voucher - The voucher to get status for
 * @returns The voucher status
 */
export function getVoucherStatus(voucher: Voucher): VoucherStatus {
  return voucher.status || 'boarding';
}

/**
 * Check if voucher bookings can be edited
 * Only allows editing when status is 'boarding'
 *
 * @param voucher - The voucher to check
 * @returns true if bookings can be edited, false otherwise
 */
export function canEditVoucher(voucher: Voucher): boolean {
  const status = getVoucherStatus(voucher);
  return status === 'boarding';
}

/**
 * Validate if a state transition is allowed
 * Enforces one-way state flow: boarding → departed → closed
 *
 * @param currentStatus - Current voucher status
 * @param newStatus - Desired new status
 * @returns true if transition is valid, false otherwise
 */
export function canTransitionToStatus(
  currentStatus: VoucherStatus,
  newStatus: VoucherStatus
): boolean {
  const transitions: Record<VoucherStatus, VoucherStatus[]> = {
    boarding: ['departed'],
    departed: ['closed'],
    closed: []
  };

  return transitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * Get display properties for a voucher status
 * Includes emoji, label, badge variant, and colors
 *
 * @param status - The voucher status
 * @returns Display properties object
 */
export function getVoucherStatusDisplay(status: VoucherStatus) {
  const displays = {
    boarding: {
      emoji: '🟢',
      label: 'Boarding',
      variant: 'secondary' as const,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-950'
    },
    departed: {
      emoji: '🔴',
      label: 'Departed',
      variant: 'destructive' as const,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-950'
    },
    closed: {
      emoji: '⚫',
      label: 'Closed',
      variant: 'outline' as const,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-800'
    }
  };

  return displays[status];
}

/**
 * Validate financial input (terminal tax or cargo)
 * Ensures value is a valid non-negative number within reasonable limits
 *
 * @param value - The input value as string
 * @param fieldName - Name of the field for error messages
 * @returns Validated number (rounded to integer)
 * @throws Error if validation fails
 */
export function validateFinancialInput(value: string, fieldName: string): number {
  const num = parseFloat(value);

  if (isNaN(num)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  if (num < 0) {
    throw new Error(`${fieldName} cannot be negative`);
  }

  if (num > 100000) {
    throw new Error(`${fieldName} exceeds maximum allowed (100,000)`);
  }

  return Math.floor(num);
}
