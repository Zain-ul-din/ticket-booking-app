/**
 * Type definitions for the ticket booking system
 */

/**
 * Vehicle types supported by the system
 */
export type VehicleType = 'highroof' | 'bus';

/**
 * Represents a single seat in a vehicle
 * Note: Booking status is tracked via voucher.bookedSeats[], not on the seat itself
 */
export interface Seat {
  id: number;              // Unique numeric identifier (e.g., 0=driver, 1-18=passenger seats)
  row: number;             // Physical row position (0-based)
  col: number;             // Physical column position (0-based)
  isFolding: boolean;      // True if this is a folding seat
  isDriver: boolean;       // True if this is the driver seat
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
 * All fields are optional, but if provided must be valid
 */
export interface Passenger {
  name?: string;                  // Full name (optional)
  cnic?: string;                  // CNIC number (formatted: XXXXX-XXXXXXX-X, optional)
  phone?: string;                 // Phone number (optional)
  gender?: 'male' | 'female';     // Gender (optional)
}

/**
 * Represents a route with origin, destination, vehicle type, and fare
 * Origin is fixed from terminal setup
 * Fare varies by destination AND vehicle type
 */
export interface Route {
  id: string;                    // Unique identifier
  origin: string;                // Starting city (from terminal)
  destination: string;           // Destination city
  vehicleType: VehicleType;      // Type of vehicle ('highroof' or 'bus')
  fare: number;                  // Price in Rs. for this destination + vehicle type
}

/**
 * Represents a booked seat with passenger details and destination
 */
export interface BookedSeat {
  seatId: number;                // Seat ID (numeric, e.g., 1, 2, 15)
  passenger: Passenger;          // Passenger information
  destination: string;           // Passenger's destination
  fare: number;                  // Base fare for this route
  discount: number;              // Discount amount applied
  finalFare: number;             // Final fare after discount (fare - discount)
}

/**
 * Represents a booking ticket (one or more seats with same passenger)
 * This is the source of truth for all booking operations
 */
export interface BookingTicket {
  id: string;                    // Unique ticket ID (UUID)
  voucherId: string;             // Reference to parent voucher
  seatIds: number[];             // Array of seat IDs (can be 1 or more)
  passenger: Passenger;          // Single passenger for all seats
  destination: string;           // Destination city
  baseFarePerSeat: number;       // Base fare per seat (from route)
  totalBaseFare: number;         // baseFarePerSeat × seatIds.length
  totalDiscount: number;         // TOTAL discount for entire booking
  finalTotal: number;            // totalBaseFare - totalDiscount
  createdAt: string;             // ISO timestamp
  updatedAt?: string;            // ISO timestamp (for edit tracking)
}

/**
 * Voucher lifecycle states
 */
export type VoucherStatus = 'boarding' | 'departed' | 'closed';

/**
 * Represents a daily trip/voucher
 */
export interface Voucher {
  id: string;                    // Unique identifier (UUID)
  vehicleId: string;             // Reference to Vehicle.id
  date: string;                  // ISO date string (YYYY-MM-DD)
  origin: string;                // Starting city for this trip
  departureTime: string;         // 24-hour format (HH:mm)
  driverName: string;            // Driver's name
  driverMobile: string;          // Driver's mobile number
  bookedSeats: BookedSeat[];     // Array of booked seats with passenger info
  createdAt: string;             // ISO timestamp when voucher was created

  // Ticket-based booking system (source of truth)
  tickets?: BookingTicket[];     // Primary booking data (auto-derives bookedSeats)

  // Voucher lifecycle management (optional for backward compatibility)
  status?: VoucherStatus;        // Lifecycle state (default: 'boarding')
  terminalTax?: number;          // Terminal tax amount (Rs.) - entered at departure
  cargo?: number;                // Cargo value (Rs.) - entered at departure
  departedAt?: string;           // ISO timestamp when marked as departed
  closedAt?: string;             // ISO timestamp when marked as closed
}

/**
 * Revenue breakdown for a single destination
 */
export interface DestinationRevenue {
  destination: string;           // Destination city name
  ticketCount: number;           // Number of tickets sold to this destination
  totalRevenue: number;          // Sum of all finalFare for this destination
}

/**
 * Financial summary for a voucher
 */
export interface VoucherFinancialSummary {
  revenueByDestination: DestinationRevenue[];  // Revenue grouped by destination
  totalFare: number;             // Sum of all ticket fares
  terminalTax: number;           // Terminal tax amount (negative impact)
  cargo: number;                 // Cargo revenue (positive impact)
  grandTotal: number;            // Total fare - terminal tax + cargo
}

/**
 * Layout constants for different vehicle types
 */
import { generateHighroofLayout, generateBusLayout } from '../utils/seatLayouts';

// Pre-generated highroof layout
export const HIGHROOF_LAYOUT = generateHighroofLayout();

// Helper to generate bus layout with custom dimensions
export { generateBusLayout };
