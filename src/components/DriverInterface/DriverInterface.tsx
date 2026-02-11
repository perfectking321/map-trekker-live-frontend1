import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BusRoute } from '@/types/bus';
import { getAvailableRoutes, startBusSimulation, stopBusSimulation, updateCrowdLevel } from '@/services/busSimulation';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DriverInterfaceProps {
  // Props, if any, will be added here
}

const DriverInterface: React.FC<DriverInterfaceProps> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [routes, setRoutes] = useState<BusRoute[]>([]);

  // Dummy login for now
  const handleLogin = () => {
    setRoutes(getAvailableRoutes());
    setIsLoggedIn(true);
  };

  const handleStartSimulation = () => {
    if (selectedRoute) {
      startBusSimulation('driver-1', selectedRoute); // Using a static driver ID for now
      setIsSimulating(true);
    }
  };

  const handleStopSimulation = () => {
    stopBusSimulation('driver-1');
    setIsSimulating(false);
  };

  const handleCrowdUpdate = (level: 'low' | 'medium' | 'high') => {
    updateCrowdLevel('driver-1', level);
  };

  if (!isLoggedIn) {
    return (
      <div>
        <Button onClick={handleLogin}>Driver Login</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="route-select">Select Route</Label>
          <Select onValueChange={setSelectedRoute} value={selectedRoute || ''}>
            <SelectTrigger id="route-select">
              <SelectValue placeholder="Choose a route..." />
            </SelectTrigger>
            <SelectContent>
              {routes.map((route) => (
                <SelectItem key={route.id} value={route.id}>
                  {route.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!isSimulating ? (
          <Button onClick={handleStartSimulation} disabled={!selectedRoute}>
            Start Sharing Location
          </Button>
        ) : (
          <Button onClick={handleStopSimulation} variant="destructive">
            Stop Sharing
          </Button>
        )}

        {isSimulating && (
          <div className="flex gap-2">
            <Button onClick={() => handleCrowdUpdate('low')}>Crowd: Low</Button>
            <Button onClick={() => handleCrowdUpdate('medium')}>Crowd: Medium</Button>
            <Button onClick={() => handleCrowdUpdate('high')}>Crowd: High</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverInterface;
