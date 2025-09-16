import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MapPin, Users, LogOut } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
import { app } from '@/firebase';

const DriverInterface = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [crowdLevel, setCrowdLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [driverId, setDriverId] = useState<string | null>(null);
  const locationWatchId = useRef<number | null>(null);

  const auth = getAuth(app);
  const db = getFirestore(app);

  // Check auth state and set driverId
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDriverId(user.uid);
        // Initialize or fetch bus data from Firestore for this driver
        // For MVP, we'll just ensure a doc exists for this driverId
        const driverDocRef = doc(db, "busLocations", user.uid);
        setDoc(driverDocRef, { 
          driverId: user.uid, 
          latitude: null, 
          longitude: null, 
          crowdLevel: 'low',
          isSharingLocation: false,
          timestamp: new Date()
        }, { merge: true });

      } else {
        setDriverId(null);
        navigate('/auth/driver'); // Redirect to auth if not logged in
      }
    });
    return () => unsubscribe();
  }, [auth, db, navigate]);

  // Handle location sharing
  useEffect(() => {
    if (!driverId) return;

    const updateLocationInFirestore = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const driverDocRef = doc(db, "busLocations", driverId);
      await updateDoc(driverDocRef, {
        latitude,
        longitude,
        timestamp: new Date(),
      });
    };

    if (isSharing) {
      if ("geolocation" in navigator) {
        locationWatchId.current = navigator.geolocation.watchPosition(
          updateLocationInFirestore,
          (error) => {
            console.error("Geolocation error:", error);
            toast({
              title: "Geolocation Error",
              description: error.message,
              variant: "destructive",
            });
            setIsSharing(false); // Stop sharing on error
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
        toast({ title: "Location Sharing Started", description: "Your live location is now being shared." });
      } else {
        toast({ title: "Error", description: "Geolocation is not supported by your browser.", variant: "destructive" });
        setIsSharing(false);
      }
    } else {
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
        locationWatchId.current = null;
        toast({ title: "Location Sharing Stopped", description: "You have stopped sharing your location." });
      }
      // Update Firestore to reflect that sharing has stopped
      const driverDocRef = doc(db, "busLocations", driverId);
      updateDoc(driverDocRef, { isSharingLocation: false });
    }

    return () => {
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
    };
  }, [isSharing, driverId, db, toast]);

  // Handle crowd level change
  useEffect(() => {
    if (!driverId) return;

    const updateCrowdLevelInFirestore = async () => {
      const driverDocRef = doc(db, "busLocations", driverId);
      await updateDoc(driverDocRef, {
        crowdLevel,
      });
    };
    updateCrowdLevelInFirestore();
  }, [crowdLevel, driverId, db]);

  const handleSharingToggle = (checked: boolean) => {
    setIsSharing(checked);
    if (driverId) {
      const driverDocRef = doc(db, "busLocations", driverId);
      updateDoc(driverDocRef, { isSharingLocation: checked });
    }
  };

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

  if (!driverId) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <p>Loading driver data or redirecting...</p>
        </div>
    );
  }

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
