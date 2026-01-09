import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Vehicle, Voucher, Route, HIGHROOF_LAYOUT, generateBusLayout } from '@/types/booking';

export interface Terminal {
  name: string;
  city: string;
  area: string;
  contactNumber: string;
}

interface BookingStore {
  terminal: Terminal | null;
  vehicles: Vehicle[];
  vouchers: Voucher[];
  routes: Route[];
  setTerminal: (terminal: Terminal) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  removeVehicle: (id: string) => void;
  addVoucher: (voucher: Omit<Voucher, 'id' | 'createdAt'>) => void;
  updateVoucher: (id: string, updates: Partial<Voucher>) => void;
  removeVoucher: (id: string) => void;
  addRoute: (route: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, updates: Partial<Route>) => void;
  removeRoute: (id: string) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
  getVoucherById: (id: string) => Voucher | undefined;
  getRouteById: (id: string) => Route | undefined;
  getRoutesByOrigin: (origin: string) => Route[];
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      terminal: null,
      vehicles: [
        // Default vehicles
        {
          id: 'highroof-1',
          name: 'High Roof Van',
          registrationNumber: 'ABC-1234',
          type: 'highroof',
          seats: HIGHROOF_LAYOUT,
          totalSeats: HIGHROOF_LAYOUT.filter(s => !s.isDriver).length,
        },
        {
          id: 'bus-1',
          name: 'Passenger Bus',
          registrationNumber: 'XYZ-5678',
          type: 'bus',
          seats: generateBusLayout(12, 4),
          totalSeats: 48,
        },
      ],
      vouchers: [],
      routes: [
        // Default routes
        { id: 'route-1', origin: 'Multan', destination: 'Lahore', fare: 1500 },
        { id: 'route-2', origin: 'Multan', destination: 'Faisalabad', fare: 1200 },
        { id: 'route-3', origin: 'Multan', destination: 'Islamabad', fare: 2500 },
        { id: 'route-4', origin: 'Lahore', destination: 'Islamabad', fare: 1800 },
      ],

      setTerminal: (terminal) => {
        set({ terminal });
      },

      addVehicle: (vehicle) => {
        const id = `vehicle-${Date.now()}`;
        set((state) => ({
          vehicles: [...state.vehicles, { ...vehicle, id }],
        }));
      },

      removeVehicle: (id) => {
        set((state) => ({
          vehicles: state.vehicles.filter((v) => v.id !== id),
        }));
      },

      addVoucher: (voucher) => {
        const id = `voucher-${Date.now()}`;
        const createdAt = new Date().toISOString();
        set((state) => ({
          vouchers: [...state.vouchers, { ...voucher, id, createdAt }],
        }));
      },

      updateVoucher: (id, updates) => {
        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            v.id === id ? { ...v, ...updates } : v
          ),
        }));
      },

      removeVoucher: (id) => {
        set((state) => ({
          vouchers: state.vouchers.filter((v) => v.id !== id),
        }));
      },

      addRoute: (route) => {
        const id = `route-${Date.now()}`;
        set((state) => ({
          routes: [...state.routes, { ...route, id }],
        }));
      },

      updateRoute: (id, updates) => {
        set((state) => ({
          routes: state.routes.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      removeRoute: (id) => {
        set((state) => ({
          routes: state.routes.filter((r) => r.id !== id),
        }));
      },

      getVehicleById: (id) => {
        return get().vehicles.find((v) => v.id === id);
      },

      getVoucherById: (id) => {
        return get().vouchers.find((v) => v.id === id);
      },

      getRouteById: (id) => {
        return get().routes.find((r) => r.id === id);
      },

      getRoutesByOrigin: (origin) => {
        return get().routes.filter((r) => r.origin.toLowerCase() === origin.toLowerCase());
      },
    }),
    {
      name: 'booking-storage',
    }
  )
);
