/**
 * Seat layout generation utilities for different vehicle types
 */

import { Seat } from "../types/booking";

/**
 * Generate seat layout for a Highroof van
 * Layout: 18 passenger seats (no driver)
 *
 * Visual layout:
 *     [1] [2]
 *     [3]
 *
 *     Row 0: [ 1 ]  [ 2 ]  [ 3 ]
 *     Row 1: [ 4 ]  [ 5 ]  [ 6 ]
 *     Row 2: [ 7 ]  [ 8 ]  [ 9 ]
 *     Row 3: [10 ]  [11 ]  [12 ] (last row - folding seats)
 *
 * @returns Array of Seat objects for highroof van
 */
export function generateHighroofLayout(): Seat[] {
  return [
    // Row 0 (Front)
    { id: 2, row: 0, col: 0, isFolding: false, isDriver: false },
    { id: 1, row: 0, col: 1, isFolding: false, isDriver: false },

    // Row 1
    { id: 6, row: 1, col: 0, isFolding: false, isDriver: false },
    { id: 5, row: 1, col: 1, isFolding: false, isDriver: false },
    { id: 4, row: 1, col: 2, isFolding: false, isDriver: false },
    { id: 3, row: 1, col: 3, isFolding: false, isDriver: false },

    // Row 2
    { id: 9, row: 2, col: 0, isFolding: false, isDriver: false },
    { id: 8, row: 2, col: 2, isFolding: false, isDriver: false },
    { id: 7, row: 2, col: 3, isFolding: false, isDriver: false },
    { id: -1, row: 2, col: 1, isFolding: true, isDriver: false }, // F

    // Row 3
    { id: 12, row: 3, col: 0, isFolding: false, isDriver: false },
    { id: 11, row: 3, col: 2, isFolding: false, isDriver: false },
    { id: 10, row: 3, col: 3, isFolding: false, isDriver: false },
    { id: -2, row: 3, col: 1, isFolding: true, isDriver: false }, // F

    // Row 4 (Back)
    { id: 16, row: 4, col: 0, isFolding: false, isDriver: false },
    { id: 15, row: 4, col: 1, isFolding: false, isDriver: false },
    { id: 14, row: 4, col: 2, isFolding: false, isDriver: false },
    { id: 13, row: 4, col: 3, isFolding: false, isDriver: false },
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
