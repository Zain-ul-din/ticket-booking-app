export type VehicleType = 'bus' | 'highroof';

export interface SeatConfig {
  id: number;
  row: number;
  col: number;
  isFolding: boolean;
  isDriver: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  registrationNumber: string;
  type: VehicleType;
  seats: SeatConfig[];
  totalSeats: number;
}

export interface Passenger {
  name: string;
  cnic: string;
  gender: 'male' | 'female';
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  fare: number;
}

export interface BookedSeat {
  seatId: number;
  passenger: Passenger;
  destination: string;
  fare: number;
  discount: number;
  finalFare: number;
}

export interface Voucher {
  id: string;
  vehicleId: string;
  date: string;
  origin: string;
  departureTime: string;
  driverName: string;
  driverMobile: string;
  bookedSeats: BookedSeat[];
  createdAt: string;
}

// Preset seat layouts
export const BUS_LAYOUT: SeatConfig[] = (() => {
  const seats: SeatConfig[] = [];
  let seatId = 1;
  
  // Bus: 4 columns, rows go back
  // Layout: Window | Aisle | Aisle | Window
  for (let row = 0; row < 13; row++) {
    for (let col = 0; col < 4; col++) {
      // Last row has 5 seats
      if (row === 12 && col === 3) {
        seats.push({ id: seatId++, row, col, isFolding: false, isDriver: false });
        seats.push({ id: seatId++, row, col: 4, isFolding: false, isDriver: false });
      } else {
        seats.push({ id: seatId++, row, col, isFolding: false, isDriver: false });
      }
    }
  }
  return seats;
})();

export const HIGHROOF_LAYOUT: SeatConfig[] = [
  // Row 0 - Driver
  { id: 0, row: 0, col: 0, isFolding: false, isDriver: true },
  { id: 1, row: 0, col: 2, isFolding: false, isDriver: false },
  { id: 2, row: 0, col: 3, isFolding: false, isDriver: false },
  // Row 1
  { id: 3, row: 1, col: 0, isFolding: false, isDriver: false },
  { id: 4, row: 1, col: 1, isFolding: false, isDriver: false },
  { id: 5, row: 1, col: 2, isFolding: false, isDriver: false },
  { id: 6, row: 1, col: 3, isFolding: false, isDriver: false },
  // Row 2
  { id: 7, row: 2, col: 0, isFolding: false, isDriver: false },
  { id: 8, row: 2, col: 1, isFolding: true, isDriver: false },
  { id: 9, row: 2, col: 2, isFolding: false, isDriver: false },
  { id: 10, row: 2, col: 3, isFolding: false, isDriver: false },
  // Row 3
  { id: 11, row: 3, col: 0, isFolding: false, isDriver: false },
  { id: 12, row: 3, col: 1, isFolding: true, isDriver: false },
  { id: 13, row: 3, col: 2, isFolding: false, isDriver: false },
  { id: 14, row: 3, col: 3, isFolding: false, isDriver: false },
  // Row 4 (last row - full)
  { id: 15, row: 4, col: 0, isFolding: false, isDriver: false },
  { id: 16, row: 4, col: 1, isFolding: false, isDriver: false },
  { id: 17, row: 4, col: 2, isFolding: false, isDriver: false },
  { id: 18, row: 4, col: 3, isFolding: false, isDriver: false },
];

export const generateBusLayout = (rows: number, cols: number): SeatConfig[] => {
  const seats: SeatConfig[] = [];
  let seatId = 1;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      seats.push({ id: seatId++, row, col, isFolding: false, isDriver: false });
    }
  }
  return seats;
};
