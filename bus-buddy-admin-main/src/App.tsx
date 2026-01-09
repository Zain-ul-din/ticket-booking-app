import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useBookingStore } from "@/store/bookingStore";
import Index from "./pages/Index";
import VehiclesPage from "./pages/VehiclesPage";
import VouchersPage from "./pages/VouchersPage";
import BookingPage from "./pages/BookingPage";
import RoutesPage from "./pages/RoutesPage";
import ReportsPage from "./pages/ReportsPage";
import TerminalSetup from "./pages/TerminalSetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { terminal } = useBookingStore();

  if (!terminal) {
    return <TerminalSetup />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/vouchers" element={<VouchersPage />} />
      <Route path="/routes" element={<RoutesPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/booking/:voucherId" element={<BookingPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
