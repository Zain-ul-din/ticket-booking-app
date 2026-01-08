/**
 * Seat layout generation utilities for different vehicle types
 */

import { Seat, SeatType } from '../types/booking';

/**
 * Generate seat layout for a Highroof van
 * Layout: 4 rows × 3 columns = 12 total (11 passenger + 1 driver)
 *
 * Visual layout:
 *     [DRIVER]
 *     [ A1 ]  [ A2 ]  [ A3 ]
 *     [ B1 ]  [ B2 ]  [ B3 ]
 *     [ C1 ]  [ C2 ]  [ C3 ]
 *     [ D1 ]  [ D2 ]  [ D3 ]
 *
 * @returns Array of Seat objects for highroof van
 */
export function generateHighroofLayout(): Seat[] {
  const seats: Seat[] = [];

  // Driver seat at row 0
  seats.push({
    id: 'DRIVER',
    row: 0,
    column: 1,
    type: 'driver',
    isBooked: false,
  });

  // Passenger seats - rows A, B, C, D (rows 1-4)
  const rows = ['A', 'B', 'C', 'D'];

  rows.forEach((rowLabel, rowIndex) => {
    for (let col = 1; col <= 3; col++) {
      const seatId = `${rowLabel}${col}`;
      // Last row seats (D1, D2, D3) are folding seats
      const isFolding = rowLabel === 'D';

      seats.push({
        id: seatId,
        row: rowIndex + 1,
        column: col - 1,
        type: isFolding ? 'folding' : 'standard',
        isBooked: false,
      });
    }
  });

  return seats;
}

/**
 * Generate seat layout for a passenger bus
 * Layout: Default 12 rows × 4 columns = 48 total (47 passenger + 1 driver)
 * Can be customized with rows and cols parameters
 *
 * Visual layout (2-2 seating):
 *     [DRIVER]
 *     [ A1 ]  [ A2 ]    [ A3 ]  [ A4 ]
 *     [ B1 ]  [ B2 ]    [ B3 ]  [ B4 ]
 *     [ C1 ]  [ C2 ]    [ C3 ]  [ C4 ]
 *     ... continues for specified rows
 *
 * @param numRows - Number of rows (default: 12)
 * @param numCols - Number of columns (default: 4)
 * @returns Array of Seat objects for bus
 */
export function generateBusLayout(numRows: number = 12, numCols: number = 4): Seat[] {
  const seats: Seat[] = [];

  // Driver seat at row 0
  seats.push({
    id: 'DRIVER',
    row: 0,
    column: 1,
    type: 'driver',
    isBooked: false,
  });

  // Generate row labels (A, B, C, ... Z, AA, AB, etc.)
  const rowLabels: string[] = [];
  for (let i = 0; i < numRows; i++) {
    if (i < 26) {
      rowLabels.push(String.fromCharCode(65 + i)); // A-Z
    } else {
      const firstLetter = String.fromCharCode(65 + Math.floor(i / 26) - 1);
      const secondLetter = String.fromCharCode(65 + (i % 26));
      rowLabels.push(firstLetter + secondLetter); // AA, AB, AC, etc.
    }
  }

  rowLabels.forEach((rowLabel, rowIndex) => {
    for (let col = 1; col <= numCols; col++) {
      const seatId = `${rowLabel}${col}`;
      // Last 2 rows are folding seats for extra capacity
      const isFolding = rowIndex >= numRows - 2;

      seats.push({
        id: seatId,
        row: rowIndex + 1,
        column: col - 1,
        type: isFolding ? 'folding' : 'standard',
        isBooked: false,
      });
    }
  });

  return seats;
}

/**
 * Get seat label for display (removes numbers, just returns letter)
 * @param seatId - Seat ID (e.g., "A1", "B2")
 * @returns Row letter (e.g., "A", "B")
 */
export function getSeatRow(seatId: string): string {
  return seatId.replace(/[0-9]/g, '');
}

/**
 * Get seat number for display
 * @param seatId - Seat ID (e.g., "A1", "B2")
 * @returns Seat number (e.g., "1", "2")
 */
export function getSeatNumber(seatId: string): string {
  return seatId.replace(/[A-Z]/g, '');
}

/**
 * Check if a seat is available (not booked and not driver)
 * @param seat - Seat object
 * @returns True if seat is available for booking
 */
export function isSeatAvailable(seat: Seat): boolean {
  return !seat.isBooked && seat.type !== 'driver';
}

/**
 * Get total available seats in a vehicle
 * @param seats - Array of all seats
 * @returns Count of available seats
 */
export function getAvailableSeatsCount(seats: Seat[]): number {
  return seats.filter(isSeatAvailable).length;
}

/**
 * Get total booked seats in a vehicle
 * @param seats - Array of all seats
 * @returns Count of booked seats
 */
export function getBookedSeatsCount(seats: Seat[]): number {
  return seats.filter(seat => seat.isBooked && seat.type !== 'driver').length;
}
