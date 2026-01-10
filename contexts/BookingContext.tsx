/**
 * Booking Context - State management with localStorage persistence
 * Provides vehicle and voucher management for the booking system
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Vehicle, Voucher, Route } from "../types/booking";
import {
  generateHighroofLayout,
  generateBusLayout,
} from "../utils/seatLayouts";
import { getTodayString } from "../utils/dateUtils";
import { migrateBookedSeatsToTickets, deriveBookedSeatsFromTickets } from "../utils/ticketUtils";

/**
 * Shape of the booking state
 */
interface BookingState {
  vehicles: Vehicle[];
  vouchers: Voucher[];
  routes: Route[];
}

/**
 * Context value type with state and methods
 */
interface BookingContextType extends BookingState {
  // Vehicle operations
  addVehicle: (vehicle: Omit<Vehicle, "id">) => string;
  updateVehicle: (vehicleId: string, updates: Partial<Vehicle>) => void;
  removeVehicle: (vehicleId: string) => void;
  getVehicleById: (vehicleId: string) => Vehicle | undefined;

  // Voucher operations
  addVoucher: (voucher: Omit<Voucher, "id" | "createdAt">) => string;
  updateVoucher: (voucherId: string, updates: Partial<Voucher>) => void;
  removeVoucher: (voucherId: string) => void;
  getVoucherById: (voucherId: string) => Voucher | undefined;

  // Route operations
  addRoute: (route: Omit<Route, "id">) => string;
  updateRoute: (routeId: string, updates: Partial<Route>) => void;
  removeRoute: (routeId: string) => void;
  getRouteById: (routeId: string) => Route | undefined;
  getRoutesByOrigin: (origin: string) => Route[];

  // Computed values
  getTodaysVouchers: () => Voucher[];
  getVouchersForDate: (date: string) => Voucher[];
  getBookedSeatsCount: (voucherId: string) => number;
}

/**
 * Default vehicles for initial state
 */
const DEFAULT_VEHICLES: Vehicle[] = [];

/**
 * Default routes for initial state
 * Each route has origin, destination, vehicle type, and fare
 * Fare varies by destination AND vehicle type
 */
const DEFAULT_ROUTES: Route[] = [
  // Multan routes - Highroof
  {
    id: "route-1",
    origin: "Multan",
    destination: "Lahore",
    vehicleType: "highroof",
    fare: 1500,
  },
  {
    id: "route-2",
    origin: "Multan",
    destination: "Faisalabad",
    vehicleType: "highroof",
    fare: 1200,
  },
  {
    id: "route-3",
    origin: "Multan",
    destination: "Islamabad",
    vehicleType: "highroof",
    fare: 2500,
  },
  // Multan routes - Bus
  {
    id: "route-4",
    origin: "Multan",
    destination: "Lahore",
    vehicleType: "bus",
    fare: 1800,
  },
  {
    id: "route-5",
    origin: "Multan",
    destination: "Faisalabad",
    vehicleType: "bus",
    fare: 1500,
  },
  {
    id: "route-6",
    origin: "Multan",
    destination: "Islamabad",
    vehicleType: "bus",
    fare: 3000,
  },
];

/**
 * localStorage key for persisting state
 */
const STORAGE_KEY = "booking-app-state";

/**
 * Create the context with undefined default
 */
const BookingContext = createContext<BookingContextType | undefined>(undefined);

/**
 * Hook to use the booking context
 * @throws Error if used outside of BookingProvider
 */
export function useBooking(): BookingContextType {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}

/**
 * Provider component props
 */
interface BookingProviderProps {
  children: ReactNode;
}

/**
 * Booking Provider - Manages state and provides context
 */
export function BookingProvider({ children }: BookingProviderProps) {
  // Initialize state from localStorage or use defaults
  const [state, setState] = useState<BookingState>(() => {
    // Only run on client side (not during SSR)
    if (typeof window === "undefined") {
      return {
        vehicles: DEFAULT_VEHICLES,
        vouchers: [],
        routes: DEFAULT_ROUTES,
      };
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as BookingState;

        // Validate that we have the required structure
        if (
          parsed.vehicles &&
          Array.isArray(parsed.vehicles) &&
          parsed.vouchers &&
          Array.isArray(parsed.vouchers)
        ) {
          // Check if data uses old structure (string IDs or 'type' field)
          const hasOldStructure = parsed.vehicles.some((vehicle) =>
            vehicle.seats.some(
              (seat: any) =>
                typeof seat.id === "string" ||
                "type" in seat ||
                "column" in seat
            )
          );

          // Check if vouchers use old structure (destination/fare fields instead of origin)
          const hasOldVoucherStructure = parsed.vouchers.some(
            (voucher: any) => "destination" in voucher || "fare" in voucher
          );

          if (hasOldStructure || hasOldVoucherStructure) {
            console.warn(
              "Detected old data structure. Clearing localStorage and using defaults."
            );
            localStorage.removeItem(STORAGE_KEY);
            return {
              vehicles: DEFAULT_VEHICLES,
              vouchers: [],
              routes: DEFAULT_ROUTES,
            };
          }

          // Ensure routes exist (for backward compatibility)
          if (!parsed.routes || !Array.isArray(parsed.routes)) {
            parsed.routes = DEFAULT_ROUTES;
          }

          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load booking state from localStorage:", error);
    }

    // Return default state if loading failed or no saved state
    return { vehicles: DEFAULT_VEHICLES, vouchers: [], routes: DEFAULT_ROUTES };
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    // Only persist on client side
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save booking state to localStorage:", error);
      }
    }
  }, [state]);

  // Auto-migrate vouchers from bookedSeats to tickets format (run once on mount)
  useEffect(() => {
    const needsMigration = state.vouchers.some(
      v => !v.tickets && v.bookedSeats?.length > 0
    );

    if (needsMigration) {
      console.log('Migrating vouchers to ticket format...');

      setState(prev => ({
        ...prev,
        vouchers: prev.vouchers.map(v => {
          if (!v.tickets && v.bookedSeats?.length > 0) {
            const tickets = migrateBookedSeatsToTickets(v.bookedSeats, v.id);
            return { ...v, tickets };
          }
          return v;
        })
      }));
    }
  }, []); // Run once on mount

  // Vehicle operations

  const addVehicle = (vehicle: Omit<Vehicle, "id">): string => {
    const id = `vehicle-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const newVehicle: Vehicle = { ...vehicle, id };

    setState((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle],
    }));

    return id;
  };

  const updateVehicle = (vehicleId: string, updates: Partial<Vehicle>): void => {
    setState((prev) => ({
      ...prev,
      vehicles: prev.vehicles.map((v) =>
        v.id === vehicleId ? { ...v, ...updates } : v
      ),
    }));
  };

  const removeVehicle = (vehicleId: string): void => {
    setState((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((v) => v.id !== vehicleId),
    }));
  };

  const getVehicleById = (vehicleId: string): Vehicle | undefined => {
    return state.vehicles.find((v) => v.id === vehicleId);
  };

  // Voucher operations

  const addVoucher = (voucher: Omit<Voucher, "id" | "createdAt">): string => {
    // Try to use crypto.randomUUID if available, otherwise fallback
    let id: string;
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      id = crypto.randomUUID();
    } else {
      id = `voucher-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const newVoucher: Voucher = {
      ...voucher,
      id,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      vouchers: [...prev.vouchers, newVoucher],
    }));

    return id;
  };

  const updateVoucher = (
    voucherId: string,
    updates: Partial<Voucher>
  ): void => {
    setState((prev) => ({
      ...prev,
      vouchers: prev.vouchers.map((v) =>
        v.id === voucherId ? { ...v, ...updates } : v
      ),
    }));
  };

  const removeVoucher = (voucherId: string): void => {
    setState((prev) => ({
      ...prev,
      vouchers: prev.vouchers.filter((v) => v.id !== voucherId),
    }));
  };

  const getVoucherById = (voucherId: string): Voucher | undefined => {
    return state.vouchers.find((v) => v.id === voucherId);
  };

  // Computed values

  const getTodaysVouchers = (): Voucher[] => {
    const today = getTodayString();
    return state.vouchers.filter((v) => v.date === today);
  };

  const getVouchersForDate = (date: string): Voucher[] => {
    return state.vouchers.filter((v) => v.date === date);
  };

  const getBookedSeatsCount = (voucherId: string): number => {
    const voucher = state.vouchers.find((v) => v.id === voucherId);
    return voucher?.bookedSeats.length || 0;
  };

  // Route operations

  const addRoute = (route: Omit<Route, "id">): string => {
    const id = `route-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRoute: Route = { ...route, id };

    setState((prev) => ({
      ...prev,
      routes: [...prev.routes, newRoute],
    }));

    return id;
  };

  const updateRoute = (routeId: string, updates: Partial<Route>): void => {
    setState((prev) => ({
      ...prev,
      routes: prev.routes.map((r) =>
        r.id === routeId ? { ...r, ...updates } : r
      ),
    }));
  };

  const removeRoute = (routeId: string): void => {
    setState((prev) => ({
      ...prev,
      routes: prev.routes.filter((r) => r.id !== routeId),
    }));
  };

  const getRouteById = (routeId: string): Route | undefined => {
    return state.routes.find((r) => r.id === routeId);
  };

  const getRoutesByOrigin = (origin: string): Route[] => {
    return state.routes.filter((r) => r.origin === origin);
  };

  // Context value
  const value: BookingContextType = {
    vehicles: state.vehicles,
    vouchers: state.vouchers,
    routes: state.routes,
    addVehicle,
    updateVehicle,
    removeVehicle,
    getVehicleById,
    addVoucher,
    updateVoucher,
    removeVoucher,
    getVoucherById,
    getTodaysVouchers,
    getVouchersForDate,
    getBookedSeatsCount,
    addRoute,
    updateRoute,
    removeRoute,
    getRouteById,
    getRoutesByOrigin,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}
