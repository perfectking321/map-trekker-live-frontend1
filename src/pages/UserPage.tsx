
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import BusMap from '@/components/Map/BusMap';
import ApiService, { BusStopsGeoJSON } from '@/services/api';
import { getLiveBuses } from '@/services/busSimulation';
import { LiveBus } from '@/types/bus';
import { ArrowLeft, Bell, LogOut } from 'lucide-react';

const UserPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // --- Auth State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '' });

  // --- App State ---
  const [busStops, setBusStops] = useState<BusStopsGeoJSON>({ type: 'FeatureCollection', features: [] });
  const [liveBuses, setLiveBuses] = useState<LiveBus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return; // Don't load data if not logged in

    const loadData = async () => {
      try {
        setLoading(true);
        const stops = await ApiService.getBusStops();
        setBusStops(stops);
      } catch (error) {
        toast({ title: "Error Loading Data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    loadData();

    const busInterval = setInterval(() => {
      setLiveBuses(getLiveBuses());
    }, 2000);

    return () => clearInterval(busInterval);
  }, [isLoggedIn, toast]);

  // --- Auth Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      setIsLoggedIn(true);
      toast({ title: "Login Successful", description: "Welcome! You can now track buses." });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.email && registerData.password) {
      setIsLoggedIn(true);
      toast({ title: "Registration Successful", description: "Welcome! You can now track buses." });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({ title: "Logged Out", description: "You have successfully logged out." });
  };

  const getCrowdLevelBadge = (level: 'low' | 'medium' | 'high') => {
    const styles = { low: 'bg-blue-500 text-white', medium: 'bg-yellow-500 text-black', high: 'bg-red-500 text-white' };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[level]}`}>{level}</span>;
  };

  // --- Render Login/Registration Page ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
         <div className="absolute top-4 left-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isLoginView ? 'User Login' : 'User Registration'}</CardTitle>
            <CardDescription>{isLoginView ? 'Enter your credentials to track buses.' : 'Create an account to get started.'}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoginView ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="user@example.com" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" placeholder="********" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} required />
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="user@example.com" value={registerData.email} onChange={e => setRegisterData({...registerData, email: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" placeholder="********" value={registerData.password} onChange={e => setRegisterData({...registerData, password: e.target.value})} required />
                </div>
                <Button type="submit" className="w-full">Register</Button>
              </form>
            )}
            <Button variant="link" className="mt-4 w-full" onClick={() => setIsLoginView(!isLoginView)}>
              {isLoginView ? 'Don\'t have an account? Register' : 'Already have an account? Login'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Render User Dashboard ---
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
                      <span className="font-bold">Route {bus.routeId.split('-')[1]}</span>
                      {getCrowdLevelBadge(bus.crowdLevel)}
                    </div>
                    <p className="text-sm text-muted-foreground">{bus.id}</p>
                    <div className="flex justify-between text-sm mt-2">
                      <span>0.8 km away</span>
                      <span>5 min ETA</span>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No nearby buses found.</p>}
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
            <BusMap busStops={busStops} />
          )}
        </main>
      </div>
    </div>
  );
};

export default UserPage;
