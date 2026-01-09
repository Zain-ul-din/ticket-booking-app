import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useBooking } from '../contexts/BookingContext';
import { AddRouteDialog } from '../components/AddRouteDialog';
import { Plus, ArrowLeft, MapPin, Trash2, ArrowRight } from 'lucide-react';

export default function RoutesPage() {
  const { routes, removeRoute } = useBooking();
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Group routes by origin
  const groupedRoutes = routes.reduce((acc, route) => {
    if (!acc[route.origin]) {
      acc[route.origin] = [];
    }
    acc[route.origin].push(route);
    return acc;
  }, {} as Record<string, typeof routes>);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Routes & Fares</h1>
              <p className="text-sm text-muted-foreground">Set fare prices for each route</p>
            </div>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Route
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {Object.keys(groupedRoutes).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Routes Yet</h2>
            <p className="text-muted-foreground mb-6">Add your first route with fare pricing</p>
            <Button onClick={() => setShowAddDialog(true)} size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Route
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedRoutes).map(([origin, originRoutes]) => (
              <div key={origin}>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  From {origin}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {originRoutes.map((route) => (
                    <Card key={route.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">{route.origin}</span>
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{route.destination}</span>
                            </div>
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
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Fare</span>
                            <span className="font-bold text-lg text-primary">
                              Rs. {route.fare.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
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
