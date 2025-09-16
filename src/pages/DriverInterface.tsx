
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, MapPin, Users, LogOut } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const DriverInterface = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [crowdLevel, setCrowdLevel] = useState<'low' | 'medium' | 'high'>('low');

  // --- Login & Registration State ---
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', busId: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend-only login simulation
    if (loginData.email && loginData.password) {
      setIsLoggedIn(true);
      toast({ title: "Login Successful", description: "Welcome back, driver!" });
    } else {
      toast({ title: "Error", description: "Please enter email and password.", variant: "destructive" });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend-only registration simulation
    if (registerData.email && registerData.password && registerData.busId) {
      setIsLoggedIn(true);
      toast({ title: "Registration Successful", description: `Welcome, driver of bus ${registerData.busId}!` });
    } else {
      toast({ title: "Error", description: "Please fill out all fields.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSharing(false);
    toast({ title: "Logged Out", description: "You have successfully logged out." });
  };

  const handleSharingToggle = (sharing: boolean) => {
    setIsSharing(sharing);
    const status = sharing ? "started" : "stopped";
    toast({
      title: `Location Sharing ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: `You have ${status} sharing your location.`,
    });
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
            <CardTitle>{isLoginView ? 'Driver Login' : 'Driver Registration'}</CardTitle>
            <CardDescription>
              {isLoginView ? 'Enter your credentials to access the dashboard.' : 'Create an account to get started.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoginView ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="driver@example.com" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" placeholder="********" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="driver@example.com" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" placeholder="********" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bus-id">Bus ID</Label>
                  <Input id="bus-id" placeholder="e.g., BUS-001" value={registerData.busId} onChange={(e) => setRegisterData({ ...registerData, busId: e.target.value })} required />
                </div>
                <Button type="submit" className="w-full">Register</Button>
              </form>
            )}
            <Button variant="link" className="mt-4 w-full" onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? 'Dont have an account? Register' : 'Already have an account? Login'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Render Driver Dashboard ---
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-border shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Driver Dashboard</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      <main className="p-4 md:p-8 space-y-6">
        {/* Location & Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapPin className="text-primary"/> Location & Status</CardTitle>
            <CardDescription>Control your live location sharing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <Label htmlFor="sharing-toggle" className="text-base font-medium">
                {isSharing ? 'Sharing Live Location' : 'Start Sharing Location'}
              </Label>
              <Switch id="sharing-toggle" checked={isSharing} onCheckedChange={handleSharingToggle} />
            </div>
          </CardContent>
        </Card>

        {/* Crowd Density Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="text-primary"/> Crowd Density</CardTitle>
            <CardDescription>Manually report the current crowd level in your bus</CardDescription>
          </CardHeader>
          <CardContent>
             <Select value={crowdLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setCrowdLevel(value)}>
              <SelectTrigger className="w-full text-base p-6">
                <SelectValue placeholder="Set Crowd Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DriverInterface;

