# Ticket Booking System - Project Documentation

## Project Overview

A desktop ticket booking application for a transport company, built with Electron 22 to run on Windows 7, 8, 10, and 11. The application allows managing vehicle fleets, creating daily trip vouchers, and booking seats for passengers.

## Goals

### Primary Goals
1. **Windows Compatibility**: Run on Windows 7, 8, 10, and 11 using Electron 22
2. **Vehicle Management**: Add, view, and manage transport vehicles (highroofs and buses)
3. **Daily Operations**: Create and manage daily trip vouchers with destinations and departure times
4. **Seat Booking**: Visual seat selection and booking system with passenger tracking
5. **Offline-First**: All data stored locally using localStorage for instant access
6. **Simple & Fast**: Lightweight desktop app optimized for daily use by transport staff

### Secondary Goals
- Professional UI with modern design patterns
- Real-time seat availability tracking
- Easy navigation between vehicles, vouchers, and bookings
- Data persistence across application restarts
- Type-safe development with TypeScript

## Technology Stack

### Core Technologies
- **Electron 22** - Desktop application framework (Chromium 108)
- **Next.js 13.1.1** - React framework with file-based routing
- **React 18.2.0** - UI library
- **TypeScript 4.9.4** - Type safety
- **Tailwind CSS 3.2.4** - Utility-first styling

### State Management
- **React Context API** - Centralized state management
- **localStorage** - Data persistence (no backend required)
- Custom hooks for accessing booking data

### UI Components
- **Lucide React** - Modern icon library
- Custom CSS classes for consistent styling
- Responsive layouts for different screen sizes

### Database (Future)
- **Prisma 4.8.1** - ORM setup (currently unused, reserved for future)
- **SQLite** - Local database option if needed

## Architecture

### Project Structure
```
ticket-booking-app/
├── components/          # Reusable React components
├── contexts/           # React Context providers
│   └── BookingContext.tsx
├── electron/           # Electron main process files
│   ├── main.js        # Main Electron entry point
│   └── preload.js     # Preload scripts for IPC
├── pages/             # Next.js pages (file-based routing)
│   ├── _app.tsx       # App wrapper with providers
│   ├── index.tsx      # Home dashboard
│   ├── vehicles.tsx   # Vehicle management (future)
│   ├── vouchers.tsx   # Voucher management (future)
│   └── booking/[id].tsx  # Seat booking page (future)
├── styles/            # Global styles
│   └── globals.css    # Tailwind + custom CSS
├── types/             # TypeScript type definitions
│   └── booking.ts     # Core data types
├── utils/             # Utility functions
│   ├── dateUtils.ts   # Date formatting
│   └── seatLayouts.ts # Seat generation logic
└── package.json       # Dependencies and scripts
```

### Data Model

#### Vehicle
```typescript
{
  id: string;                 // Unique identifier
  name: string;               // Display name (e.g., "Highroof 1")
  registrationNumber: string; // License plate (e.g., "ABC-1234")
  type: 'highroof' | 'bus';  // Vehicle type
  seats: Seat[];              // All seats including driver
  totalSeats: number;         // Bookable seats (excludes driver)
}
```

#### Voucher (Daily Trip)
```typescript
{
  id: string;            // UUID
  vehicleId: string;     // Reference to Vehicle
  date: string;          // ISO date (YYYY-MM-DD)
  destination: string;   // Destination city
  departureTime: string; // 24-hour format (HH:mm)
  bookedSeats: string[]; // Array of booked seat IDs
  createdAt: string;     // ISO timestamp
}
```

#### Seat
```typescript
{
  id: string;              // Seat identifier (e.g., "A1", "B2")
  row: number;             // Row position (0-based)
  column: number;          // Column position (0-based)
  type: 'standard' | 'folding' | 'driver';
  isBooked: boolean;       // Booking status
  passengerName?: string;  // Passenger name if booked
}
```

### State Management Flow

1. **Initialization**
   - BookingProvider loads data from localStorage on mount
   - If no saved data, initializes with default vehicles
   - Context provides state and methods to all components

2. **Data Modification**
   - Components call context methods (addVehicle, addVoucher, etc.)
   - Context updates React state
   - useEffect automatically saves to localStorage
   - UI re-renders with new data

3. **Data Persistence**
   - All changes auto-saved to localStorage
   - Key: `booking-app-state`
   - Survives application restarts
   - No backend required

### Vehicle Seat Layouts

#### Highroof Van (12 seats)
- Layout: 4 rows × 3 columns
- 1 driver seat (non-bookable)
- 11 passenger seats
- Last row (D1, D2, D3) are folding seats

```
    [DRIVER]
    [ A1 ]  [ A2 ]  [ A3 ]
    [ B1 ]  [ B2 ]  [ B3 ]
    [ C1 ]  [ C2 ]  [ C3 ]
    [ D1* ] [ D2* ] [ D3* ]
    (* = folding seats)
```

#### Passenger Bus (48 seats)
- Layout: 12 rows × 4 columns
- 2-2 seating with center aisle
- 1 driver seat (non-bookable)
- 47 passenger seats
- Last 2 rows (K, L) are folding seats

```
    [DRIVER]
    [ A1 ]  [ A2 ]    [ A3 ]  [ A4 ]
    [ B1 ]  [ B2 ]    [ B3 ]  [ B4 ]
    ...
    [ K1* ] [ K2* ]   [ K3* ] [ K4* ]
    [ L1* ] [ L2* ]   [ L3* ] [ L4* ]
    (* = folding seats)
```

## Current Implementation Status

### ✅ Completed (Phase 1)

1. **Project Setup**
   - Installed lucide-react for icons
   - Configured TypeScript and Tailwind
   - Set up project structure

2. **Core Utilities**
   - Date formatting utilities (Windows 7 compatible)
   - Seat layout generators for both vehicle types
   - Type-safe TypeScript definitions

3. **State Management**
   - BookingContext with React Context API
   - localStorage persistence
   - Default vehicles (Highroof 1, Bus 1)
   - CRUD operations for vehicles and vouchers

4. **Home Dashboard**
   - Quick stats (vehicles, trips, bookings)
   - Navigation cards to Vehicles and Vouchers
   - Today's trips list
   - Empty states for new users

5. **Styling**
   - Custom CSS classes for cards and buttons
   - Responsive layouts
   - Consistent color scheme
   - Seat color system (available, booked, folding, driver)

### 🔄 In Progress

- Testing the home page implementation
- Verifying Windows 7 compatibility

### 📋 To Do (Future Phases)

1. **Vehicle Management Page** (`/vehicles`)
   - List all vehicles
   - Add new vehicle form
   - Edit/delete vehicles
   - View vehicle details

2. **Voucher Management Page** (`/vouchers`)
   - List all vouchers (by date)
   - Create new voucher form
   - Edit/delete vouchers
   - Filter by date/vehicle

3. **Seat Booking Page** (`/booking/[id]`)
   - Visual seat layout
   - Click to book/unbook seats
   - Passenger name input
   - Save booking changes
   - Print voucher/ticket

4. **Additional Features**
   - Search functionality
   - Reports and statistics
   - Export data (CSV, PDF)
   - Backup/restore functionality
   - Multi-language support
   - Print layouts for tickets

## Development Workflow

### Running the Application

**Development Mode:**
```bash
npm run dev
# Runs both Next.js dev server and Electron concurrently
# Next.js: http://localhost:3000
# Electron: Desktop window
```

**Next.js Only:**
```bash
npm run next-dev
# Just the Next.js development server
```

**Electron Only:**
```bash
npm run electron-dev
# Requires Next.js running on port 3000
```

**Production Build:**
```bash
npm run build
# Builds Next.js app for production
```

### Development Tips

1. **Hot Reload**: Changes to React components auto-reload in browser
2. **Electron Restart**: Changes to main.js require Electron restart
3. **localStorage**: Use browser DevTools → Application → Local Storage to inspect
4. **TypeScript**: Check types with `npx tsc --noEmit`
5. **Debugging**: Use Chrome DevTools (Electron has it built-in)

## Windows 7 Compatibility Notes

### Compatible Features ✅
- Electron 22 (Chromium 108)
- React 18.2.0
- Next.js 13.1.1
- localStorage API
- CSS Grid and Flexbox
- ES6+ features (polyfilled by Next.js)

### Compatibility Considerations
- **crypto.randomUUID()**: Available in Chromium 108 ✓
- **toLocaleDateString()**: Full support ✓
- **padStart()**: Polyfilled by Next.js ✓
- **async/await**: Full support ✓

### Testing Requirements
- Test on Windows 7 VM or physical machine
- Verify localStorage persistence
- Check date formatting displays correctly
- Test Electron window functionality
- Validate all user interactions

## Design Decisions

### Why React Context Instead of Zustand?
- No external dependencies to maintain
- Built into React (guaranteed compatibility)
- Simple localStorage integration
- Easier to debug and understand
- Sufficient for application complexity

### Why Lucide React for Icons?
- Matches the original MVP exactly
- Modern, well-maintained library
- Consistent icon style
- Tree-shakeable (only imports used icons)
- Compatible with React 18

### Why Native Date Methods?
- No dependency on date-fns
- Simpler and lighter
- Windows 7 compatible
- Sufficient for formatting needs
- Reduces bundle size

### Why No Backend?
- Offline-first requirement
- Simple deployment (just run Electron)
- No server maintenance needed
- Fast performance (local data)
- Can add backend later if needed

## Future Enhancements

### Short Term
- Complete vehicle management page
- Complete voucher management page
- Complete seat booking page
- Add form validation
- Improve error handling

### Medium Term
- Add search and filtering
- Generate reports
- Print tickets/vouchers
- Export data functionality
- Keyboard shortcuts

### Long Term
- Multi-user support
- Cloud sync option (optional)
- Mobile companion app
- SMS notifications
- Payment tracking
- Analytics dashboard

## Contributing

This is a private project for a transport company. The codebase is maintained by the development team. When making changes:

1. Follow existing code patterns
2. Maintain TypeScript type safety
3. Test on Windows 7+ before committing
4. Update this documentation for major changes
5. Keep Windows 7 compatibility in mind

## Support & Contact

For issues, questions, or feature requests, contact the development team or create an issue in the project repository.

---

**Last Updated**: January 8, 2026
**Version**: 0.1.0 (Phase 1 Complete)
**Status**: Home Dashboard Implemented ✅
