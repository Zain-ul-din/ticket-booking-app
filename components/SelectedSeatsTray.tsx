import { Seat } from "../types/booking";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, ArrowRight } from "lucide-react";

interface SelectedSeatsTrayProps {
  selectedSeats: Seat[];
  onClearAll: () => void;
  onBook: () => void;
}

export function SelectedSeatsTray({
  selectedSeats,
  onClearAll,
  onBook,
}: SelectedSeatsTrayProps) {
  const count = selectedSeats.length;
  const isVisible = count > 0;

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-primary shadow-2xl print:hidden"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="container max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left: Selected seats */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">
              Selected:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedSeats.slice(0, 10).map((seat) => (
                <Badge
                  key={seat.id}
                  className="px-3 py-1.5 text-base font-bold bg-orange-500 hover:bg-orange-600 text-white border-0"
                >
                  {seat.id}
                </Badge>
              ))}
              {count > 10 && (
                <Badge className="px-3 py-1.5 text-base font-semibold bg-orange-200 text-orange-900 border-orange-400">
                  +{count - 10} more
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="default"
              onClick={onClearAll}
              className="gap-1 text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>

          {/* Right: Book button */}
          <Button onClick={onBook} size="lg" className="gap-2 shadow-lg">
            Book {count} {count === 1 ? "Seat" : "Seats"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
