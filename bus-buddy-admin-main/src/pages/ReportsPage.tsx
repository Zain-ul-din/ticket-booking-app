import { useMemo, useState } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Users, Banknote, Bus, Calendar, Percent } from "lucide-react";
import { format, subDays, startOfDay, isWithinInterval, parseISO } from "date-fns";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(142 76% 36%)', 'hsl(38 92% 50%)', 'hsl(280 65% 60%)'];

const ReportsPage = () => {
  const { vouchers, vehicles } = useBookingStore();
  const [period, setPeriod] = useState<'7' | '30'>('7');

  const stats = useMemo(() => {
    const days = parseInt(period);
    const startDate = startOfDay(subDays(new Date(), days - 1));
    const endDate = new Date();

    // Filter vouchers within period
    const periodVouchers = vouchers.filter((v) => {
      try {
        const voucherDate = parseISO(v.date);
        return isWithinInterval(voucherDate, { start: startDate, end: endDate });
      } catch {
        return false;
      }
    });

    // Calculate totals
    let totalRevenue = 0;
    let totalDiscount = 0;
    let totalPassengers = 0;
    const dailyData: Record<string, { date: string; revenue: number; passengers: number; discount: number }> = {};
    const destinationData: Record<string, number> = {};
    const vehicleData: Record<string, { name: string; revenue: number; passengers: number }> = {};

    // Initialize daily data
    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
      dailyData[date] = { date, revenue: 0, passengers: 0, discount: 0 };
    }

    periodVouchers.forEach((voucher) => {
      const dateKey = voucher.date;
      const vehicle = vehicles.find((v) => v.id === voucher.vehicleId);

      voucher.bookedSeats.forEach((seat) => {
        totalRevenue += seat.finalFare;
        totalDiscount += seat.discount;
        totalPassengers += 1;

        // Daily breakdown
        if (dailyData[dateKey]) {
          dailyData[dateKey].revenue += seat.finalFare;
          dailyData[dateKey].passengers += 1;
          dailyData[dateKey].discount += seat.discount;
        }

        // Destination breakdown
        destinationData[seat.destination] = (destinationData[seat.destination] || 0) + seat.finalFare;

        // Vehicle breakdown
        if (vehicle) {
          if (!vehicleData[vehicle.id]) {
            vehicleData[vehicle.id] = { name: vehicle.name, revenue: 0, passengers: 0 };
          }
          vehicleData[vehicle.id].revenue += seat.finalFare;
          vehicleData[vehicle.id].passengers += 1;
        }
      });
    });

    const dailyChartData = Object.values(dailyData).map((d) => ({
      ...d,
      label: format(parseISO(d.date), 'MMM dd'),
    }));

    const destinationChartData = Object.entries(destinationData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const vehicleChartData = Object.values(vehicleData)
      .sort((a, b) => b.revenue - a.revenue);

    const avgDailyRevenue = totalRevenue / days;
    const avgPassengersPerDay = totalPassengers / days;

    return {
      totalRevenue,
      totalDiscount,
      totalPassengers,
      totalTrips: periodVouchers.length,
      avgDailyRevenue,
      avgPassengersPerDay,
      dailyChartData,
      destinationChartData,
      vehicleChartData,
    };
  }, [vouchers, vehicles, period]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Revenue Reports"
        subtitle="Track earnings and booking statistics"
        backTo="/"
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Tabs value={period} onValueChange={(v) => setPeriod(v as '7' | '30')} className="space-y-6">
          <TabsList>
            <TabsTrigger value="7">Last 7 Days</TabsTrigger>
            <TabsTrigger value="30">Last 30 Days</TabsTrigger>
          </TabsList>

          <TabsContent value={period} className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Banknote className="h-4 w-4" />
                    Total Revenue
                  </div>
                  <p className="text-2xl font-bold text-primary">Rs. {stats.totalRevenue.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Percent className="h-4 w-4" />
                    Total Discount
                  </div>
                  <p className="text-2xl font-bold text-orange-500">Rs. {stats.totalDiscount.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Users className="h-4 w-4" />
                    Passengers
                  </div>
                  <p className="text-2xl font-bold">{stats.totalPassengers}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Bus className="h-4 w-4" />
                    Total Trips
                  </div>
                  <p className="text-2xl font-bold">{stats.totalTrips}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <TrendingUp className="h-4 w-4" />
                    Avg Daily
                  </div>
                  <p className="text-2xl font-bold">Rs. {Math.round(stats.avgDailyRevenue).toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4" />
                    Avg Passengers
                  </div>
                  <p className="text-2xl font-bold">{stats.avgPassengersPerDay.toFixed(1)}/day</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Daily Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daily Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.dailyChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.dailyChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="label" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No data available for this period
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Revenue by Destination */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Destinations by Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.destinationChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.destinationChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {stats.destinationChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No destination data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Vehicle Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehicle Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.vehicleChartData.length > 0 ? (
                  <div className="space-y-4">
                    {stats.vehicleChartData.map((vehicle, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <div>
                            <p className="font-medium">{vehicle.name}</p>
                            <p className="text-sm text-muted-foreground">{vehicle.passengers} passengers</p>
                          </div>
                        </div>
                        <p className="font-bold text-primary">Rs. {vehicle.revenue.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No vehicle data available for this period
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ReportsPage;
