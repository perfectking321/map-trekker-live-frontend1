# Marauder's Map AI - Real-time Bus Tracking System

## Project Idea

Marauder's Map AI is a real-time, AI-driven bus tracking system designed for small Tier 2 cities and towns. Inspired by the magical Marauder's Map, it aims to keep track of the live location of buses, enhancing public transport reliability and competitiveness.

## Solution Highlights (MVP for Hackathon)

This project focuses on delivering a Minimum Viable Product (MVP) for a hackathon, prioritizing core functionalities for drivers and users.

### Key Features Implemented:

1.  **Authentication System:**
    *   Secure login and registration flows for both **Drivers** and **Users** using Firebase Authentication.
    *   Redirection to respective dashboards (`/driver` or `/user`) upon successful authentication.

2.  **Driver Interface:**
    *   **Live Location Sharing:** Drivers can start and stop sharing their real-time GPS location, which is then updated in Google Firestore.
    *   **Crowd Density Reporting:** Drivers can manually set the current crowd level in their bus (Low, Medium, High), with this data also stored in Firestore.

3.  **User Interface:**
    *   **Live Bus Tracking:** Users can view the real-time GPS locations of active buses on an interactive map. Bus markers display current crowd density.
    *   **Bus Stops & Routes:** Predefined bus routes and bus stop locations are displayed on the map.
    *   **Walking ETA to Bus Stops:** Users can click on a bus stop to calculate and display the walking route, distance, and estimated time from their current location to the selected bus stop (using OSRM).
    *   **Bus ETA to Next Stop:** A simplified estimation of the time a bus will take to reach its next designated stop is displayed in the sidebar.

## Technology Stack

*   **Frontend Framework:** React, TypeScript
*   **UI Components:** `shadcn/ui`
*   **Mapping:** Leaflet, `react-leaflet` (implicitly used for map components), `leaflet-routing-machine`
*   **Routing Service:** OSRM (Open Source Routing Machine) API for pathfinding and ETA.
*   **Geolocation:** Browser's native Geolocation API, `geolib` for distance calculations.
*   **State Management/Routing:** React Router DOM
*   **Backend & Database:**
    *   **Authentication:** Firebase Authentication
    *   **Real-time Database:** Google Firestore (for live bus locations, crowd data)
*   **Build Tool:** Vite

## How to Run the Project

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd marauders-map-ai
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```
Or using yarn:
```bash
yarn install
```

### 3. Set up Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  Add a web app to your Firebase project and copy your `firebaseConfig` object.
4.  Open `src/firebase.ts` in your project and replace the placeholder values with your actual `firebaseConfig`.

    ```typescript
    // src/firebase.ts
    export const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```

5.  Enable **Email/Password** authentication in your Firebase project (Authentication -> Sign-in method).
6.  In Firestore, ensure you have a collection named `busLocations` for storing bus data. You might need to set up basic security rules (for a hackathon, a permissive rule might be `allow read, write: if request.auth != null;` for `busLocations` while in development).

### 4. Start the Development Server

```bash
npm run dev
# or with yarn
yarn dev
```

The application should now be running in your browser, typically at `http://localhost:5173`.

## Project Structure (Key Files)

*   `public/images/bus-icon.png`: Custom bus icon for the map.
*   `src/App.tsx`: Main application component, sets up routing.
*   `src/firebase.ts`: Firebase configuration and initialization.
*   `src/data.json`: Mock data for bus stops and routes (for MVP).
*   `src/pages/Index.tsx`: The landing page with options for Driver, User, and Admin interfaces.
*   `src/pages/AuthPage.tsx`: Handles user login and registration (for both drivers and users).
*   `src/components/Auth/Login.tsx`: Login form logic with Firebase.
*   `src/components/Auth/Register.tsx`: Registration form logic with Firebase.
*   `src/pages/DriverInterface.tsx`: Driver dashboard for location sharing and crowd density reporting.
*   `src/pages/UserPage.tsx`: User interface for live bus tracking, ETA, and bus stop details.
*   `src/components/Map/BusMap.tsx`: Leaflet map component displaying buses, stops, routes, and user location.
*   `src/services/api.ts`: Service for fetching static map data (bus stops, routes).
*   `src/types/bus.ts`: TypeScript type definitions for bus-related data.

## Future Enhancements (Beyond MVP)

*   **Advanced ETA Predictions:** Integrate AI models combining traffic, weather, and historical data.
*   **AR Navigation:** Implement augmented reality features for guiding passengers to bus stops.
*   **Gamified Green Miles:** Reward users for eco-friendly commuting.
*   **Offline-First Design:** Ensure functionality even in low-network areas.
*   **Comprehensive Admin Dashboard:** Implement fleet monitoring, route optimization, and predictive delay alerts.
*   **Notifications:** Real-time push notifications for bus arrivals/delays.
*   **Persistence:** Store user preferences, selected routes, etc.
*   **Search and Filters:** Enhanced search functionality for bus stops and routes.
