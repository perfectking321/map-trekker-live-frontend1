import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import BusMap from '@/components/Map/BusMap';
import ApiService, { BusStopsGeoJSON } from '@/services/api';
// import { getLiveBuses } from '@/services/busSimulation'; // We will replace this with Firestore
import { LiveBus } from '@/types/bus';
import { Bell, LogOut } from 'lucide-react';

import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from '@/firebase';

const UserPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [busStops, setBusStops] = useState<BusStopsGeoJSON>({ type: 'FeatureCollection', features: [] });
  const [liveBuses, setLiveBuses] = useState<LiveBus[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const auth = getAuth(app);
  const db = getFirestore(app);

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
        navigator.geolocation.getCurrentPosition(
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
      }
    }
  }, [isLoggedIn, toast]);


  // Fetch Bus Stops from API Service (or later, Firestore)
  useEffect(() => {
    const loadBusStops = async () => {
      try {
        setLoading(true);
        const stops = await ApiService.getBusStops();
        setBusStops(stops);
      } catch (error) {
        console.error("Error loading bus stops:", error);
        toast({ title: "Error Loading Bus Stops", description: "Could not fetch bus stop data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      loadBusStops();
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
            location: [data.longitude, data.latitude], // Corrected to [longitude, latitude]
            routeId: data.routeId || `ROUTE-${doc.id.slice(0, 3).toUpperCase()}`,
            crowdLevel: data.crowdLevel || 'low',
            nextStopIndex: data.nextStopIndex || 0, // Assuming a default or retrieving from data
            speed: data.speed || 0, // Assuming a default or retrieving from data
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have successfully logged out." });
      navigate('/'); // Redirect to home or auth page after logout
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message,
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
                      <span className="font-bold">{bus.routeId}</span>
                      {getCrowdLevelBadge(bus.crowdLevel)}
                    </div>
                    <p className="text-sm text-muted-foreground">Bus ID: {bus.id}</p>
                    <div className="flex justify-between text-sm mt-2">
                      {/* These will be dynamically calculated later */}
                      <span>Distance: --</span>
                      <span>ETA: --</span>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No nearby buses found or sharing location.</p>}
              </div>
            </CardContent>
          </Card>
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
              // Removed liveBuses and userLocation props as BusMap manages these internally
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default UserPage;
