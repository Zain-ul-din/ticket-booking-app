/**
 * Seat layout generation utilities for different vehicle types
 */

import { Seat } from '../types/booking';

/**
 * Generate seat layout for a Highroof van
 * Layout: 12 passenger seats (no driver)
 *
 * Visual layout:
 *     Row 0: [ 1 ]  [ 2 ]  [ 3 ]
 *     Row 1: [ 4 ]  [ 5 ]  [ 6 ]
 *     Row 2: [ 7 ]  [ 8 ]  [ 9 ]
 *     Row 3: [10 ]  [11 ]  [12 ] (last row - folding seats)
 *
 * @returns Array of Seat objects for highroof van
 */
export function generateHighroofLayout(): Seat[] {
  const seats: Seat[] = [];
  let seatId = 1;

  // 4 rows × 3 columns = 12 seats (no driver)
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const isFolding = row === 3; // Last row are folding seats
      seats.push({
        id: seatId++,
        row,
        col,
        isFolding,
        isDriver: false,
      });
    }
  }

  return seats;
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

