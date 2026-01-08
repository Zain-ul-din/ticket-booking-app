/**
 * Booking Context - State management with localStorage persistence
 * Provides vehicle and voucher management for the booking system
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, Voucher } from '../types/booking';
import { generateHighroofLayout, generateBusLayout } from '../utils/seatLayouts';
import { getTodayString } from '../utils/dateUtils';

/**
 * Shape of the booking state
 */
interface BookingState {
  vehicles: Vehicle[];
  vouchers: Voucher[];
}

/**
 * Context value type with state and methods
 */
interface BookingContextType extends BookingState {
  // Vehicle operations
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => string;
  removeVehicle: (vehicleId: string) => void;
  getVehicleById: (vehicleId: string) => Vehicle | undefined;

  // Voucher operations
  addVoucher: (voucher: Omit<Voucher, 'id' | 'createdAt'>) => string;
  updateVoucher: (voucherId: string, updates: Partial<Voucher>) => void;
  removeVoucher: (voucherId: string) => void;
  getVoucherById: (voucherId: string) => Voucher | undefined;

  // Computed values
  getTodaysVouchers: () => Voucher[];
  getVouchersForDate: (date: string) => Voucher[];
  getBookedSeatsCount: (voucherId: string) => number;
}

/**
 * Default vehicles for initial state
 */
const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: 'highroof-1',
    name: 'Highroof 1',
    registrationNumber: 'HR-001',
    type: 'highroof',
    seats: generateHighroofLayout(),
    totalSeats: 11,
  },
  {
    id: 'bus-1',
    name: 'Bus 1',
    registrationNumber: 'BUS-001',
    type: 'bus',
    seats: generateBusLayout(),
    totalSeats: 47,
  },
];

/**
 * localStorage key for persisting state
 */
const STORAGE_KEY = 'booking-app-state';

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
    throw new Error('useBooking must be used within a BookingProvider');
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
    if (typeof window === 'undefined') {
      return { vehicles: DEFAULT_VEHICLES, vouchers: [] };
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as BookingState;

        // Validate that we have the required structure
        if (parsed.vehicles && Array.isArray(parsed.vehicles) &&
            parsed.vouchers && Array.isArray(parsed.vouchers)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load booking state from localStorage:', error);
    }

    // Return default state if loading failed or no saved state
    return { vehicles: DEFAULT_VEHICLES, vouchers: [] };
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    // Only persist on client side
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save booking state to localStorage:', error);
      }
    }
  }, [state]);

  // Vehicle operations

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>): string => {
    const id = `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newVehicle: Vehicle = { ...vehicle, id };

    setState(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle],
    }));

    return id;
  };

  const removeVehicle = (vehicleId: string): void => {
    setState(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter(v => v.id !== vehicleId),
    }));
  };

  const getVehicleById = (vehicleId: string): Vehicle | undefined => {
    return state.vehicles.find(v => v.id === vehicleId);
  };

  // Voucher operations

  const addVoucher = (voucher: Omit<Voucher, 'id' | 'createdAt'>): string => {
    // Try to use crypto.randomUUID if available, otherwise fallback
    let id: string;
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      id = crypto.randomUUID();
    } else {
      id = `voucher-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const newVoucher: Voucher = {
      ...voucher,
      id,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      vouchers: [...prev.vouchers, newVoucher],
    }));

    return id;
  };

  const updateVoucher = (voucherId: string, updates: Partial<Voucher>): void => {
    setState(prev => ({
      ...prev,
      vouchers: prev.vouchers.map(v =>
        v.id === voucherId ? { ...v, ...updates } : v
      ),
    }));
  };

  const removeVoucher = (voucherId: string): void => {
    setState(prev => ({
      ...prev,
      vouchers: prev.vouchers.filter(v => v.id !== voucherId),
    }));
  };

  const getVoucherById = (voucherId: string): Voucher | undefined => {
    return state.vouchers.find(v => v.id === voucherId);
  };

  // Computed values

  const getTodaysVouchers = (): Voucher[] => {
    const today = getTodayString();
    return state.vouchers.filter(v => v.date === today);
  };

  const getVouchersForDate = (date: string): Voucher[] => {
    return state.vouchers.filter(v => v.date === date);
  };

  const getBookedSeatsCount = (voucherId: string): number => {
    const voucher = state.vouchers.find(v => v.id === voucherId);
    return voucher?.bookedSeats.length || 0;
  };

  // Context value
  const value: BookingContextType = {
    vehicles: state.vehicles,
    vouchers: state.vouchers,
    addVehicle,
    removeVehicle,
    getVehicleById,
    addVoucher,
    updateVoucher,
    removeVoucher,
    getVoucherById,
    getTodaysVouchers,
    getVouchersForDate,
    getBookedSeatsCount,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}
