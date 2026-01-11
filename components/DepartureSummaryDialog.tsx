import { useState, useMemo } from 'react';
import { Voucher, Vehicle } from '../types/booking';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { DollarSign, Package, AlertCircle, Printer } from 'lucide-react';
import { calculateVoucherFinancialSummary, validateFinancialInput } from '../utils/voucherUtils';
import { printVoucherSummary } from '../utils/printVoucher';
import { useTerminal } from '../contexts/TerminalContext';
import { toast } from '../utils/toast';

interface DepartureSummaryDialogProps {
  open: boolean;
  onClose: () => void;
  voucher: Voucher;
  vehicle: Vehicle | undefined;
  onConfirm?: (terminalTax: number, cargo: number) => void;
  printOnly?: boolean;
}

export function DepartureSummaryDialog({
  open,
  onClose,
  voucher,
  vehicle,
  onConfirm,
  printOnly = false,
}: DepartureSummaryDialogProps) {
  const { terminalInfo } = useTerminal();
  const [terminalTax, setTerminalTax] = useState('0');
  const [cargo, setCargo] = useState('0');
  const [error, setError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Calculate financial summary
  const summary = useMemo(() => {
    const taxValue = parseFloat(terminalTax) || 0;
    const cargoValue = parseFloat(cargo) || 0;
    return calculateVoucherFinancialSummary(voucher, taxValue, cargoValue);
  }, [voucher, terminalTax, cargo]);

  const handleConfirm = () => {
    try {
      setError('');
      validateFinancialInput(terminalTax, 'Terminal tax');
      validateFinancialInput(cargo, 'Cargo');
      // Show confirmation dialog
      setShowConfirmDialog(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  const handleFinalConfirm = () => {
    const validatedTax = parseFloat(terminalTax) || 0;
    const validatedCargo = parseFloat(cargo) || 0;
    setShowConfirmDialog(false);
    if (onConfirm) {
      onConfirm(validatedTax, validatedCargo);
    }
  };

  const handleClose = () => {
    setTerminalTax('0');
    setCargo('0');
    setError('');
    onClose();
  };

  const handlePrint = async () => {
    if (!terminalInfo) {
      toast.error('Terminal info not configured');
      return;
    }
    if (!vehicle) {
      toast.error('Vehicle information not available');
      return;
    }
    await printVoucherSummary(voucher, vehicle, summary, terminalInfo.name);
  };

  const hasBookings = voucher.bookedSeats.length > 0;
  const totalSeats = vehicle ? vehicle.totalSeats : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Mark as Departed - Financial Summary</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Voucher Info */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Vehicle</p>
              <p className="font-semibold">{vehicle?.name || 'Unknown'}</p>
              <p className="text-sm text-muted-foreground font-mono">{vehicle?.registrationNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bookings</p>
              <p className="font-semibold">{voucher.bookedSeats.length}/{totalSeats} seats</p>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Revenue Breakdown</h3>

            {!hasBookings ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No bookings for this trip. You can still mark it as departed.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Destination</th>
                      <th className="text-center px-4 py-3 font-semibold">Tickets</th>
                      <th className="text-right px-4 py-3 font-semibold">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.revenueByDestination.map((item, index) => (
                      <tr key={item.destination} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="px-4 py-2">{item.destination}</td>
                        <td className="text-center px-4 py-2">
                          <Badge variant="secondary">{item.ticketCount}</Badge>
                        </td>
                        <td className="text-right px-4 py-2 font-mono">
                          Rs. {item.totalRevenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 bg-primary/5">
                      <td className="px-4 py-3 font-bold">Total</td>
                      <td className="text-center px-4 py-3">
                        <Badge>{voucher.bookedSeats.length}</Badge>
                      </td>
                      <td className="text-right px-4 py-3 font-bold font-mono text-lg">
                        Rs. {summary.totalFare.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Financial Details</h3>

            {/* Terminal Tax */}
            <div className="space-y-2">
              <Label htmlFor="terminalTax" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Terminal Tax (Rs.)
              </Label>
              <Input
                id="terminalTax"
                type="number"
                placeholder="0"
                value={terminalTax}
                onChange={(e) => setTerminalTax(e.target.value)}
                className="h-12 text-lg font-mono"
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Amount deducted from total revenue
              </p>
            </div>

            {/* Cargo */}
            <div className="space-y-2">
              <Label htmlFor="cargo" className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                Cargo (Rs.)
              </Label>
              <Input
                id="cargo"
                type="number"
                placeholder="0"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="h-12 text-lg font-mono"
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Additional revenue from cargo
              </p>
            </div>
          </div>

          {/* Grand Total Calculation */}
          <div className="p-4 bg-primary/5 rounded-xl space-y-2 border border-primary/20">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Fare:</span>
              <span className="font-mono">Rs. {summary.totalFare.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Minus Terminal Tax:</span>
              <span className="font-mono">Rs. {summary.terminalTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Plus Cargo:</span>
              <span className="font-mono">Rs. {summary.cargo.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t-2 border-primary/30">
              <div className="flex justify-between font-bold text-xl">
                <span>Grand Total:</span>
                <span className={`font-mono ${summary.grandTotal < 0 ? 'text-red-600' : 'text-primary'}`}>
                  Rs. {summary.grandTotal.toLocaleString()} ✨
                </span>
              </div>
            </div>

            {summary.grandTotal < 0 && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 h-4" />
                <AlertDescription>
                  Grand total is negative. Please verify terminal tax amount.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleClose} className="h-12">
            {printOnly ? 'Close' : 'Cancel'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            className="h-12 gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Summary
          </Button>
          {!printOnly && onConfirm && (
            <Button
              type="button"
              onClick={handleConfirm}
              variant="destructive"
              className="h-12 px-8"
            >
              Confirm Departure
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Departure</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this voucher as departed? This action will prevent any further bookings or modifications.
              <br /><br />
              <strong>Grand Total: Rs. {summary.grandTotal.toLocaleString()}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, Mark as Departed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
