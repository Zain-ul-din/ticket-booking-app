import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/store/bookingStore';
import { AddRouteDialog } from '@/components/AddRouteDialog';
import { AppHeader } from '@/components/AppHeader';
import { Plus, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function RoutesPage() {
  const { routes, removeRoute } = useBookingStore();
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
      <AppHeader
        title="Routes & Fares"
        subtitle="Set fare prices for each route"
        backTo="/"
        actions={
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Route
          </Button>
        }
      />

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {Object.keys(groupedRoutes).length === 0 ? (
          <div className="section-card text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No Routes Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first route with fare pricing
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Route
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
