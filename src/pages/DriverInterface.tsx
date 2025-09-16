import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Users, Navigation, ArrowLeft, Wifi } from 'lucide-react';

const DriverInterface = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [crowdLevel, setCrowdLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Django backend authentication
    // For now, simulate login
    setIsLoggedIn(true);
    toast({
      title: "Login Successful",
      description: "Welcome back, driver!",
    });
  };

  const startLocationSharing = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsSharing(true);
          toast({
            title: "Location Sharing Started",
            description: "Your live location is now being shared.",
          });
          // TODO: Send location to Django backend
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to access location. Please enable GPS.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const stopLocationSharing = () => {
    setIsSharing(false);
    setCurrentLocation(null);
    toast({
      title: "Location Sharing Stopped",
      description: "Your location is no longer being shared.",
    });
  };

  const updateCrowdLevel = (level: 'low' | 'medium' | 'high') => {
    setCrowdLevel(level);
    // TODO: Send crowd density to Django backend
    toast({
      title: "Crowd Level Updated",
      description: `Bus crowd density set to ${level}.`,
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSharing(false);
    setCurrentLocation(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="absolute top-4 left-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-2xl">Driver Login</CardTitle>
            <CardDescription>
              Access your driver dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Driver ID / Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your driver ID"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
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
            <h1 className="text-2xl font-bold text-foreground">Driver Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={isSharing ? "default" : "secondary"}>
              <Wifi className="h-3 w-3 mr-1" />
              {isSharing ? "Live" : "Offline"}
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <Tabs defaultValue="location" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="location">Location & Status</TabsTrigger>
            <TabsTrigger value="crowd">Crowd Density</TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="space-y-6">
            {/* Location Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Live Location Sharing
                </CardTitle>
                <CardDescription>
                  Share your real-time location with passengers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isSharing ? (
                  <Button onClick={startLocationSharing} className="w-full">
                    Start Sharing Location
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                        <span className="font-medium">Location Active</span>
                      </div>
                      {currentLocation && (
                        <p className="text-sm text-muted-foreground">
                          Lat: {currentLocation.lat.toFixed(6)}, 
                          Lng: {currentLocation.lng.toFixed(6)}
                        </p>
                      )}
                    </div>
                    <Button 
                      onClick={stopLocationSharing} 
                      variant="destructive" 
                      className="w-full"
                    >
                      Stop Sharing Location
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bus Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Bus Status
                </CardTitle>
                <CardDescription>
                  Update your current bus status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline">On Route</Button>
                  <Button variant="outline">At Stop</Button>
                  <Button variant="outline">Delayed</Button>
                  <Button variant="outline">Break</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crowd" className="space-y-6">
            {/* Crowd Density */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Crowd Density Report
                </CardTitle>
                <CardDescription>
                  Report current passenger density in your bus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Current Level:</p>
                  <Badge 
                    variant={crowdLevel === 'low' ? 'default' : crowdLevel === 'medium' ? 'secondary' : 'destructive'}
                    className="text-lg px-4 py-2"
                  >
                    {crowdLevel.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={crowdLevel === 'low' ? 'default' : 'outline'}
                    className="h-20 flex-col"
                    onClick={() => updateCrowdLevel('low')}
                  >
                    <Users className="h-6 w-6 mb-1" />
                    <span>LOW</span>
                    <span className="text-xs">Few passengers</span>
                  </Button>
                  
                  <Button
                    variant={crowdLevel === 'medium' ? 'default' : 'outline'}
                    className="h-20 flex-col"
                    onClick={() => updateCrowdLevel('medium')}
                  >
                    <Users className="h-6 w-6 mb-1" />
                    <span>MEDIUM</span>
                    <span className="text-xs">Half full</span>
                  </Button>
                  
                  <Button
                    variant={crowdLevel === 'high' ? 'default' : 'outline'}
                    className="h-20 flex-col"
                    onClick={() => updateCrowdLevel('high')}
                  >
                    <Users className="h-6 w-6 mb-1" />
                    <span>HIGH</span>
                    <span className="text-xs">Nearly full</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DriverInterface;