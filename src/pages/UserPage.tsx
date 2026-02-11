import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import BusMap from '@/components/Map/BusMap'; // Removed BusRoutePath import from BusMap
import ApiService, { BusStopsGeoJSON, BusStopFeature, BusRoutePath } from '@/services/api'; // BusRoutePath now imported from ApiService
import { LiveBus } from '@/types/bus';
import { Bell, LogOut, Bus as BusIcon } from 'lucide-react'; // Walking is now directly imported

import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from '@/firebase';

import * as geolib from 'geolib';

// Import Leaflet and Leaflet Routing Machine
import L from 'leaflet';
import 'leaflet-routing-machine';

const UserPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [busStops, setBusStops] = useState<BusStopsGeoJSON>({ type: 'FeatureCollection', features: [] });
  const [busRoutes, setBusRoutes] = useState<BusRoutePath[]>([]);
  const [liveBuses, setLiveBuses] = useState<LiveBus[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedBusStop, setSelectedBusStop] = useState<BusStopFeature | null>(null);
  const [walkingRouteInfo, setWalkingRouteInfo] = useState<{ distance: string; time: string } | null>(null);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  // Check auth state and set userId
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        navigate('/auth/user'); // Redirect to auth if not logged in
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  // Fetch User Location
  useEffect(() => {
    if (isLoggedIn) {
      if ("geolocation" in navigator) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting user location:", error);
            toast({
              title: "Geolocation Error",
              description: "Could not retrieve your location. Map features may be limited.",
              variant: "destructive",
            });
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
      }
    }
  }, [isLoggedIn, toast]);

  // Fetch Bus Stops and Routes from API Service
  useEffect(() => {
    const loadMapData = async () => {
      try {
        setLoading(true);
        const [stops, routes] = await Promise.all([
          ApiService.getBusStops(),
          ApiService.getBusRoutes(),
        ]);
        setBusStops(stops);
        setBusRoutes(routes);
      } catch (error) {
        console.error("Error loading map data:", error);
        toast({ title: "Error Loading Map Data", description: "Could not fetch bus stop or route data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      loadMapData();
    }
  }, [isLoggedIn, toast]);

  // Real-time Bus Locations from Firestore
  useEffect(() => {
    if (!isLoggedIn) return;

    const busLocationsRef = collection(db, "busLocations");
    const unsubscribe = onSnapshot(busLocationsRef, (snapshot) => {
      const buses: LiveBus[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isSharingLocation && data.latitude !== null && data.longitude !== null) {
          buses.push({
            id: doc.id,
            location: [data.longitude, data.latitude], 
            routeId: data.routeId || `ROUTE-${doc.id.slice(0, 3).toUpperCase()}`,
            crowdLevel: data.crowdLevel || 'low',
            nextStopIndex: data.nextStopIndex || 0, 
            speed: data.speed || 0, 
          });
        }
      });
      setLiveBuses(buses);
    }, (error) => {
      console.error("Error fetching real-time bus locations:", error);
      toast({
        title: "Real-time Data Error",
        description: "Could not fetch live bus locations.",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [isLoggedIn, db, toast]);

  // Handle bus stop selection for walking route
  const handleBusStopSelect = (busStop: BusStopFeature) => {
    setSelectedBusStop(busStop);
    setWalkingRouteInfo(null); // Clear previous info

    if (userLocation && busStop.geometry.type === 'Point') {
      const busStopCoords = { latitude: busStop.geometry.coordinates[1], longitude: busStop.geometry.coordinates[0] };
      const userCoords = { latitude: userLocation.lat, longitude: userLocation.lng };

      // Display walking route on map
      if (routingControlRef.current) {
        routingControlRef.current.setWaypoints([
          L.latLng(userCoords.latitude, userCoords.longitude),
          L.latLng(busStopCoords.latitude, busStopCoords.longitude)
        ]);
        routingControlRef.current.route();

        routingControlRef.current.on('routesfound', (e) => {
          const route = e.routes[0];
          if (route) {
            const distanceKm = route.summary.totalDistance / 1000;
            const timeMinutes = route.summary.totalTime / 60;
            setWalkingRouteInfo({
              distance: `${distanceKm.toFixed(2)} km`,
              time: `${Math.round(timeMinutes)} min`,
            });
          }
        });
      }
    } else if (!userLocation) {
      toast({ title: "Location Needed", description: "Please enable location services to calculate walking routes.", variant: "info" });
    }
  };

  // Calculate ETA for buses to their next stop
  const getBusEtaToNextStop = (bus: LiveBus) => {
    const route = busRoutes.find(r => r.id === bus.routeId);
    if (!route || bus.nextStopIndex >= route.path.length) return "N/A";

    const nextStopCoords = route.path[bus.nextStopIndex]; // [lng, lat]
    const busLocation = { latitude: bus.location[1], longitude: bus.location[0] };
    const stopLocation = { latitude: nextStopCoords[1], longitude: nextStopCoords[0] };

    // Simple straight-line distance for MVP
    const distanceMeters = geolib.getDistance(busLocation, stopLocation);
    // Assuming an average bus speed for ETA (e.g., 20 km/h = 5.56 m/s)
    const averageBusSpeed_mps = 20 * 1000 / 3600; 
    if (averageBusSpeed_mps === 0) return "N/A";
    
    const timeSeconds = distanceMeters / averageBusSpeed_mps;
    const timeMinutes = Math.round(timeSeconds / 60);

    return `${timeMinutes} min`;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have successfully logged out." });
      navigate('/'); // Redirect to home or auth page after logout
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error logging out",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getCrowdLevelBadge = (level: 'low' | 'medium' | 'high') => {
    const styles = { low: 'bg-blue-500 text-white', medium: 'bg-yellow-500 text-black', high: 'bg-red-500 text-white' };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[level]}`}>{level.charAt(0).toUpperCase() + level.slice(1)}</span>;
  };

  if (!isLoggedIn || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p>{isLoggedIn ? "Loading Map..." : "Redirecting to login..."}</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-border shadow-sm">
        <div className="flex items-center gap-4">
           <h1 className="text-xl font-bold">Bus Tracker</h1>
        </div>
         <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-full md:w-1/3 lg:w-1/4 p-4 space-y-6 overflow-y-auto border-r border-border">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Nearby Buses</h2>
              <div className="space-y-4">
                {liveBuses.length > 0 ? liveBuses.map(bus => (
                  <div key={bus.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold flex items-center gap-2"><BusIcon className="h-4 w-4" /> {bus.routeId}</span>
                      {getCrowdLevelBadge(bus.crowdLevel)}
                    </div>
                    <p className="text-sm text-muted-foreground">Bus ID: {bus.id}</p>
                    <div className="flex justify-between text-sm mt-2">
                      <span>ETA to next stop: {getBusEtaToNextStop(bus)}</span>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No nearby buses found or sharing location.</p>}
              </div>
            </CardContent>
          </Card>

          {selectedBusStop && userLocation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Walking className="text-primary" /> Walking to {selectedBusStop.properties.name}</CardTitle>
                <CardDescription>Route from your location to the selected bus stop.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {walkingRouteInfo ? (
                  <div className="space-y-2">
                    <p className="text-sm">Distance: <span className="font-medium">{walkingRouteInfo.distance}</span></p>
                    <p className="text-sm">Estimated Time: <span className="font-medium">{walkingRouteInfo.time}</span></p>
                    <Button variant="outline" className="w-full mt-2" onClick={() => {
                      setSelectedBusStop(null);
                      setWalkingRouteInfo(null);
                      if (routingControlRef.current) {
                        routingControlRef.current.setWaypoints([]); // Clear route
                      }
                    }}>Clear Route</Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Calculating route...</p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2">Arrival Alerts</h2>
              <p className="text-sm text-muted-foreground mb-4">Get notified when your bus approaches.</p>
              <div className="flex items-center justify-between">
                <label htmlFor="notifications-switch" className="font-medium">Enable Notifications</label>
                <Switch id="notifications-switch" />
              </div>
            </CardContent>
          </Card>
        </aside>
        <main className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <p>Loading Map...</p>
            </div>
          ) : (
            <BusMap 
              busStops={busStops} 
              liveBuses={liveBuses}
              userLocation={userLocation}
              busRoutes={busRoutes}
              onBusStopSelect={handleBusStopSelect}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default UserPage;
