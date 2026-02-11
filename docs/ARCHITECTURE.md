# Architecture & API Documentation

This document describes the architecture, data flow, and API structure of Map Trekker Live.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Data Models](#data-models)
4. [API Reference](#api-reference)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [Real-time Data Flow](#real-time-data-flow)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (React App)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  User Interface    │  Driver Interface  │  Admin Panel │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Router (Navigation)                 │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Components & UI Layer (shadcn/ui)             │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │        State Management (React Context + Hooks)        │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Services Layer (API, Firebase)              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Firebase   │  │  Leaflet Map │  │  OSRM API    │      │
│  │              │  │              │  │              │      │
│  │ - Auth       │  │ - Tiles      │  │ - Routing    │      │
│  │ - Firestore  │  │ - Markers    │  │ - ETA        │      │
│  │ - Analytics  │  │ - Controls   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Framework
- **React 18.3**: UI library
- **TypeScript 5.8**: Type safety
- **Vite 5.4**: Build tool and dev server

### UI & Styling
- **shadcn/ui**: Component library
- **Radix UI**: Accessible primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### Mapping
- **Leaflet 1.9.4**: Interactive maps
- **leaflet-routing-machine**: Routing display
- **geolib**: Distance calculations

### Backend & Services
- **Firebase Auth**: User authentication
- **Firestore**: Real-time database
- **OSRM**: Route calculation API

### Routing & State
- **React Router DOM 6.30**: Client-side routing
- **React Query**: Server state management
- **React Context**: Global state

---

## Data Models

### User

```typescript
interface User {
  uid: string;
  email: string;
  userType: 'user' | 'driver' | 'admin';
  displayName?: string;
  createdAt: Date;
  lastLogin?: Date;
}
```

### Bus Location

```typescript
interface BusLocation {
  busId: string;
  busNumber: string;
  location: {
    latitude: number;
    longitude: number;
  };
  crowdDensity: 'low' | 'medium' | 'high';
  isActive: boolean;
  lastUpdated: Timestamp;
  driverId: string;
  route: string;
  speed?: number;
  heading?: number;
}
```

### Bus Stop

```typescript
interface BusStop {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  routes: string[];
  amenities?: string[];
  address?: string;
}
```

### Route

```typescript
interface Route {
  id: string;
  name: string;
  stops: string[];
  polyline: [number, number][];
  color: string;
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  frequency?: number; // minutes
}
```

### ETA Calculation

```typescript
interface ETAResult {
  distance: number; // meters
  duration: number; // seconds
  route: [number, number][];
}
```

---

## API Reference

### Firebase Authentication

#### Register User
```typescript
async function registerUser(
  email: string, 
  password: string,
  userType: 'user' | 'driver'
): Promise<User>
```

#### Login User
```typescript
async function loginUser(
  email: string, 
  password: string
): Promise<User>
```

#### Logout
```typescript
async function logoutUser(): Promise<void>
```

#### Get Current User
```typescript
function getCurrentUser(): User | null
```

---

### Firestore Operations

#### Add/Update Bus Location
```typescript
async function updateBusLocation(
  busId: string,
  location: GeolocationPosition,
  crowdDensity: 'low' | 'medium' | 'high'
): Promise<void>

// Usage in Driver Interface
await setDoc(doc(db, 'busLocations', busId), {
  busId,
  busNumber: '42A',
  location: {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  },
  crowdDensity,
  isActive: true,
  lastUpdated: serverTimestamp(),
  driverId: user.uid,
  route: 'route-1'
});
```

#### Listen to Bus Locations (Real-time)
```typescript
function subscribeToBusLocations(
  callback: (buses: BusLocation[]) => void
): Unsubscribe

// Usage in User Interface
const unsubscribe = onSnapshot(
  collection(db, 'busLocations'),
  (snapshot) => {
    const buses = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(bus => bus.isActive);
    callback(buses);
  }
);

// Cleanup
return () => unsubscribe();
```

#### Deactivate Bus (Stop Sharing)
```typescript
async function deactivateBus(busId: string): Promise<void>

// Usage
await updateDoc(doc(db, 'busLocations', busId), {
  isActive: false,
  lastUpdated: serverTimestamp()
});
```

---

### OSRM Routing API

#### Get Walking Route
```typescript
async function getWalkingRoute(
  from: [number, number], // [lng, lat]
  to: [number, number]
): Promise<ETAResult>

// Example
const from: [number, number] = [77.5946, 12.9716]; // [longitude, latitude]
const to: [number, number] = [77.6148, 12.9344];

const url = `https://router.project-osrm.org/route/v1/foot/${from[0]},${from[1]};${to[0]},${to[1]}?overview=full&geometries=geojson`;

const response = await fetch(url);
const data = await response.json();

return {
  distance: data.routes[0].distance,
  duration: data.routes[0].duration,
  route: data.routes[0].geometry.coordinates
};
```

#### Calculate ETA
```typescript
function calculateETA(durationInSeconds: number): string

// Example
const etaMinutes = Math.ceil(duration / 60);
return `${etaMinutes} min`;
```

---

### Geolocation API

#### Get User Location
```typescript
function getUserLocation(): Promise<GeolocationPosition>

// Usage
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      // Use coordinates
    },
    (error) => {
      console.error('Error getting location:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
}
```

#### Watch User Location (Continuous)
```typescript
function watchUserLocation(
  callback: (position: GeolocationPosition) => void
): number

// Usage (Driver Interface)
const watchId = navigator.geolocation.watchPosition(
  (position) => {
    updateBusLocation(busId, position, crowdDensity);
  },
  (error) => console.error(error),
  {
    enableHighAccuracy: true,
    distanceFilter: 10 // Update every 10 meters
  }
);

// Cleanup
navigator.geolocation.clearWatch(watchId);
```

---

## Component Architecture

### Component Hierarchy

```
App
├── Router
    ├── Index (Landing Page)
    │   ├── Header
    │   └── Role Selection Cards
    │
    ├── AuthPage
    │   ├── Login
    │   └── Register
    │
    ├── UserPage
    │   ├── Header
    │   ├── BusMap
    │   │   ├── Map Controls
    │   │   ├── Bus Markers
    │   │   ├── Stop Markers
    │   │   ├── Route Polylines
    │   │   └── Routing Machine
    │   ├── BusStopDetails (Sidebar)
    │   └── FilterPanel
    │
    ├── DriverInterface
    │   ├── Header
    │   ├── Location Toggle
    │   ├── Crowd Density Selector
    │   └── Status Display
    │
    └── AdminInterface
        ├── Header
        ├── Fleet Monitor
        └── Analytics Dashboard
```

### Component Best Practices

1. **Single Responsibility**: Each component has one job
2. **Composition**: Build complex UIs from simple components
3. **Props Over State**: Pass data down via props
4. **Hooks for Logic**: Extract reusable logic into custom hooks
5. **TypeScript**: Strong typing for props and state

---

## State Management

### Local State (useState)
- Form inputs
- UI toggles (modals, dropdowns)
- Component-specific data

### Context State (React Context)
- Theme (dark/light mode)
- Authentication state
- Global UI preferences

### Server State (React Query / Firestore Listeners)
- Bus locations (real-time)
- User data
- Routes and stops

### URL State (React Router)
- Current page/route
- User type (from URL params)
- Query parameters

---

## Real-time Data Flow

### Driver Location Updates

```
Driver Interface → Browser Geolocation API
                ↓
        GPS Coordinates
                ↓
   Firestore.setDoc(busLocations/{busId})
                ↓
       Firebase Cloud Firestore
                ↓
     Firestore Real-time Listener
                ↓
         User Interface
                ↓
       Update Map Markers
```

### User Tracking Buses

```
User Interface → Firestore.onSnapshot(busLocations)
              ↓
      Real-time Updates
              ↓
    Filter Active Buses
              ↓
   Update Map with Markers
              ↓
   User Clicks Bus Stop
              ↓
Calculate Walking Route (OSRM API)
              ↓
   Display Route & ETA
```

---

## Performance Considerations

### Optimization Techniques

1. **Code Splitting**: Lazy load routes
   ```typescript
   const UserPage = lazy(() => import('./pages/UserPage'));
   ```

2. **Memoization**: Prevent unnecessary re-renders
   ```typescript
   const MemoizedMap = React.memo(BusMap);
   ```

3. **Debouncing**: Limit Firestore writes
   ```typescript
   const debouncedUpdate = debounce(updateLocation, 5000);
   ```

4. **Virtualization**: For large lists use virtual scrolling

5. **Image Optimization**: Use appropriate formats and sizes

---

## Security Best Practices

1. **Environment Variables**: Never commit secrets
2. **Firestore Rules**: Implement proper access control
3. **Input Validation**: Validate all user inputs
4. **Authentication**: Use Firebase Auth tokens
5. **HTTPS Only**: Enforce secure connections

---

## Testing Strategy

### Unit Tests
- Utility functions
- Custom hooks
- Data transformations

### Integration Tests
- Component interactions
- API calls
- State updates

### E2E Tests
- User flows (login, view map, etc.)
- Driver workflows
- Critical paths

---

## Error Handling

### Global Error Boundary
```typescript
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

### Service-Level Errors
```typescript
try {
  await updateBusLocation(busId, location);
} catch (error) {
  console.error('Failed to update location:', error);
  toast.error('Failed to share location');
}
```

### Network Errors
- Display offline indicators
- Queue updates for retry
- Provide fallback data

---

## Future Architecture Enhancements

1. **Backend API**: Node.js/Express for complex operations
2. **WebSockets**: For lower-latency updates
3. **Service Workers**: Offline functionality
4. **Redis Cache**: Reduce Firestore reads
5. **Machine Learning**: AI-powered ETA predictions
6. **Microservices**: Separate concerns (auth, routing, analytics)

---

## Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
