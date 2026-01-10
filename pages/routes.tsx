import { useState } from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useBooking } from "../contexts/BookingContext";
import { useTerminal } from "../contexts/TerminalContext";
import { AddRouteDialog } from "../components/AddRouteDialog";
import {
  Plus,
  ArrowLeft,
  MapPin,
  Trash2,
  ArrowRight,
  Bus,
  Car,
} from "lucide-react";

export default function RoutesPage() {
  const { routes, removeRoute } = useBooking();
  const { terminalInfo } = useTerminal();
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Only show routes from terminal location
  const terminalRoutes = routes.filter(
    (route) => route.origin === terminalInfo?.city
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/manage">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Routes & Fares</h1>
              <p className="text-sm text-muted-foreground">
                Set fare prices for each route
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Route
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {!terminalInfo?.city ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Terminal Not Set Up</h2>
            <p className="text-muted-foreground mb-6">
              Please complete terminal setup first
            </p>
            <Link href="/terminal-setup">
              <Button size="lg">Go to Terminal Setup</Button>
            </Link>
          </div>
        ) : terminalRoutes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Routes Yet</h2>
            <p className="text-muted-foreground mb-6">
              Add your first route with fare pricing from {terminalInfo.city}
            </p>
            <Button
              onClick={() => setShowAddDialog(true)}
              size="lg"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Route
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {terminalRoutes.map((route) => (
              <Card key={route.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{route.origin}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{route.destination}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeRoute(route.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="gap-1">
                      {route.vehicleType === "highroof" ? (
                        <Car className="w-3 h-3" />
                      ) : (
                        <Bus className="w-3 h-3" />
                      )}
                      <span className="capitalize">{route.vehicleType}</span>
                    </Badge>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Fare
                      </span>
                      <span className="font-bold text-lg text-primary">
                        Rs. {route.fare.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AddRouteDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
}
