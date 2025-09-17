import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import BusMap, { BusRoutePath } from '@/components/Map/BusMap';
import ApiService, { BusStopsGeoJSON } from '@/services/api';
import { LiveBus } from '@/types/bus';
import { 
  ArrowLeft, 
  Shield, 
  Bus, 
  Route as RouteIcon, 
  AlertTriangle,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  MapPin,
  LogOut
} from 'lucide-react';

import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from '@/firebase';

const AdminInterface = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminId, setAdminId] = useState<string | null>(null);
  const [busStops, setBusStops] = useState<BusStopsGeoJSON>({ type: 'FeatureCollection', features: [] });
  const [busRoutes, setBusRoutes] = useState<BusRoutePath[]>([]);
  const [liveBuses, setLiveBuses] = useState<LiveBus[]>([]);
  const [selectedBus, setSelectedBus] = useState<LiveBus | null>(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const db = getFirestore(app);

  // Check auth state and set adminId
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // For MVP, we assume any authenticated user reaching here via /admin is an admin
        setAdminId(user.uid);
      } else {
        setAdminId(null);
        navigate('/auth/admin'); // Redirect to auth if not logged in as admin
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

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

    if (adminId) {
      loadMapData();
    }
  }, [adminId, toast]);

  // Real-time Bus Locations from Firestore
  useEffect(() => {
    if (!adminId) return;

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
  }, [adminId, db, toast]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "Admin session ended." });
      navigate('/'); // Redirect to home after logout
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

  if (!adminId || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p>{adminId ? "Loading Admin Dashboard..." : "Redirecting to login..."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Dashboard
            </h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <Tabs defaultValue="fleet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="fleet">Fleet Monitor</TabsTrigger>
            <TabsTrigger value="routes">Route Optimization</TabsTrigger>
            <TabsTrigger value="alerts">Predictive Alerts</TabsTrigger>
            <TabsTrigger value="insights">Data Insights</TabsTrigger>
          </TabsList>

          {/* Fleet Monitoring */}
          <TabsContent value="fleet" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
              {/* Fleet Status Sidebar */}
              <div className="lg:col-span-1 space-y-4 lg:max-h-full lg:overflow-y-auto">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Fleet Status</CardTitle>
                    <CardDescription>Real-time bus monitoring</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {liveBuses.length > 0 ? liveBuses.map((bus) => (
                      <div 
                        key={bus.id} 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedBus?.id === bus.id ? 'border-primary bg-accent' : 'border-border'
                        }`}
                        onClick={() => setSelectedBus(bus)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-sm">{bus.id}</p>
                            <p className="text-xs text-muted-foreground">{bus.routeId}</p>
                          </div>
                          {getCrowdLevelBadge(bus.crowdLevel)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Status:</span>
                            <Badge variant={bus.location ? 'default' : 'secondary'} className="text-xs">
                              {bus.location ? 'Active' : 'Offline'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )) : <p className="text-sm text-muted-foreground">No active buses found.</p>}
                  </CardContent>
                </Card>

                {selectedBus && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Bus Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{selectedBus.id}</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Route:</span>
                            <span>{selectedBus.routeId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Crowd:</span>
                            {getCrowdLevelBadge(selectedBus.crowdLevel)}
                          </div>
                           <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant={selectedBus.location ? 'default' : 'secondary'}>
                              {selectedBus.location ? 'Active' : 'Offline'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Fleet Map */}
              <div className="lg:col-span-3 relative">
                <BusMap
                  busStops={busStops}
                  liveBuses={liveBuses}
                  userLocation={null}
                  busRoutes={busRoutes}
                  // Admin map doesn't need onBusStopSelect
                />
                
                <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg z-[1000]">
                  <div className="flex items-center gap-2 mb-2">
                    <Bus className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Fleet Overview</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Active Buses:</span>
                      <span className="text-success">{liveBuses.length}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Total Routes:</span>
                      <span className="text-foreground">{busRoutes.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Route Optimization (Placeholder)*/}
          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RouteIcon className="h-5 w-5" />
                  Route Optimization (Coming Soon)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Advanced route optimization features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Predictive Alerts (Placeholder)*/}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Predictive Alerts (Coming Soon)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">AI-driven predictive delay and diversion alerts will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Insights (Placeholder)*/}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Data Insights (Coming Soon)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Detailed data insights and analytics will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminInterface;
