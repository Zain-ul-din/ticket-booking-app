/**
 * Type definitions for the ticket booking system
 */

/**
 * Seat types available in vehicles
 */
export type SeatType = 'standard' | 'folding' | 'driver';

/**
 * Vehicle types supported by the system
 */
export type VehicleType = 'highroof' | 'bus';

/**
 * Represents a single seat in a vehicle
 */
export interface Seat {
  id: string;              // Unique identifier (e.g., "A1", "B2", "DRIVER")
  row: number;             // Physical row position (0-based)
  column: number;          // Physical column position (0-based)
  type: SeatType;          // Type of seat
  isBooked: boolean;       // Current booking status
  passengerName?: string;  // Name of passenger if booked
}

/**
 * Represents a vehicle in the fleet
 */
export interface Vehicle {
  id: string;                    // Unique identifier (e.g., "highroof-1", "bus-1")
  name: string;                  // Display name (e.g., "Highroof 1")
  registrationNumber: string;    // Vehicle registration (e.g., "ABC-1234")
  type: VehicleType;             // Type of vehicle
  seats: Seat[];                 // Array of all seats including driver
  totalSeats: number;            // Total bookable seats (excludes driver)
}

/**
 * Represents passenger information
 */
export interface Passenger {
  name: string;                  // Full name
  cnic: string;                  // CNIC number (formatted: XXXXX-XXXXXXX-X)
  gender: 'male' | 'female';     // Gender
}

/**
 * Represents a booked seat with passenger details
 */
export interface BookedSeat {
  seatId: string;                // Seat ID (e.g., "A1", "B2")
  passenger: Passenger;          // Passenger information
}

/**
 * Represents a daily trip/voucher
 */
export interface Voucher {
  id: string;                    // Unique identifier (UUID)
  vehicleId: string;             // Reference to Vehicle.id
  date: string;                  // ISO date string (YYYY-MM-DD)
  destination: string;           // Destination city/location
  departureTime: string;         // 24-hour format (HH:mm)
  fare: number;                  // Ticket fare in Rs.
  driverName: string;            // Driver's name
  driverMobile: string;          // Driver's mobile number
  bookedSeats: BookedSeat[];     // Array of booked seats with passenger info
  createdAt: string;             // ISO timestamp when voucher was created
}

/**
 * Layout constants for different vehicle types
 */
import { generateHighroofLayout, generateBusLayout } from '../utils/seatLayouts';

// Pre-generated highroof layout
export const HIGHROOF_LAYOUT = generateHighroofLayout();

// Helper to generate bus layout with custom dimensions
export { generateBusLayout };
