/**
 * Seat layout generation utilities for different vehicle types
 */

import { Seat } from '../types/booking';

/**
 * Generate seat layout for a Highroof van
 * Layout: 18 passenger seats + 1 driver = 19 total
 *
 * Visual layout (matches bus-buddy-admin-main):
 *     Row 0: [0-Driver]       [ 1 ]  [ 2 ]
 *     Row 1: [ 3 ]  [ 4 ]  [ 5 ]  [ 6 ]
 *     Row 2: [ 7 ]  [8-F]  [ 9 ]  [10 ]
 *     Row 3: [11 ]  [12-F] [13 ]  [14 ]
 *     Row 4: [15 ]  [16 ]  [17 ]  [18 ]
 *
 * F = Folding seat
 *
 * @returns Array of Seat objects for highroof van
 */
export function generateHighroofLayout(): Seat[] {
  return [
    // Row 0 - Driver + 2 passenger seats
    { id: 0, row: 0, col: 0, isFolding: false, isDriver: true },
    { id: 1, row: 0, col: 2, isFolding: false, isDriver: false },
    { id: 2, row: 0, col: 3, isFolding: false, isDriver: false },
    // Row 1
    { id: 3, row: 1, col: 0, isFolding: false, isDriver: false },
    { id: 4, row: 1, col: 1, isFolding: false, isDriver: false },
    { id: 5, row: 1, col: 2, isFolding: false, isDriver: false },
    { id: 6, row: 1, col: 3, isFolding: false, isDriver: false },
    // Row 2 - includes seat 8 (folding)
    { id: 7, row: 2, col: 0, isFolding: false, isDriver: false },
    { id: 8, row: 2, col: 1, isFolding: true, isDriver: false },
    { id: 9, row: 2, col: 2, isFolding: false, isDriver: false },
    { id: 10, row: 2, col: 3, isFolding: false, isDriver: false },
    // Row 3 - includes seat 12 (folding)
    { id: 11, row: 3, col: 0, isFolding: false, isDriver: false },
    { id: 12, row: 3, col: 1, isFolding: true, isDriver: false },
    { id: 13, row: 3, col: 2, isFolding: false, isDriver: false },
    { id: 14, row: 3, col: 3, isFolding: false, isDriver: false },
    // Row 4 (last row)
    { id: 15, row: 4, col: 0, isFolding: false, isDriver: false },
    { id: 16, row: 4, col: 1, isFolding: false, isDriver: false },
    { id: 17, row: 4, col: 2, isFolding: false, isDriver: false },
    { id: 18, row: 4, col: 3, isFolding: false, isDriver: false },
  ];
}

/**
 * Generate seat layout for a passenger bus
 * Layout: Default 12 rows × 4 columns = 48 total seats
 * Can be customized with rows and cols parameters
 *
 * Visual layout (2-2 seating):
 *     [ 1 ]  [ 2 ]    [ 3 ]  [ 4 ]
 *     [ 5 ]  [ 6 ]    [ 7 ]  [ 8 ]
 *     [ 9 ]  [10 ]    [11 ]  [12 ]
 *     ... continues for specified rows
 *
 * @param rows - Number of rows (default: 12)
 * @param cols - Number of columns (default: 4)
 * @returns Array of Seat objects for bus
 */
export function generateBusLayout(rows: number = 12, cols: number = 4): Seat[] {
  const seats: Seat[] = [];
  let seatId = 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      seats.push({ id: seatId++, row, col, isFolding: false, isDriver: false });
    }
  }

  return seats;
}

