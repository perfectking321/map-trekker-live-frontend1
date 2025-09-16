import React, { useState } from 'react';
import { MapIcon, Settings, Info } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import ApiService from '@/services/api';

interface HeaderProps {
  onApiUrlChange?: (url: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onApiUrlChange }) => {
  const [apiUrl, setApiUrl] = useState('https://your-api-endpoint.com');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleApiUrlSave = () => {
    ApiService.setBaseURL(apiUrl);
    onApiUrlChange?.(apiUrl);
    setDialogOpen(false);
  };

  return (
    <header className="bg-card border-b border-border shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Marauder's Map
              </h1>
              <p className="text-sm text-muted-foreground">
                Bus Tracking System
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />
            {/* API Configuration */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>API Configuration</DialogTitle>
                  <DialogDescription>
                    Configure your backend API endpoint for bus stop data.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-url">API Base URL</Label>
                    <Input
                      id="api-url"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="https://your-api-endpoint.com"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your Django backend API endpoint
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleApiUrlSave} className="flex-1">
                      Save Configuration
                    </Button>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Info */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="w-4 h-4 mr-2" />
                  About
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>About Marauder's Map</DialogTitle>
                  <DialogDescription>
                    Real-time bus tracking system for Tier 2 cities
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-2 text-sm">
                        <p><strong>Version:</strong> 1.0.0 (MVP)</p>
                        <p><strong>Backend:</strong> Django + PostGIS</p>
                        <p><strong>Frontend:</strong> React + Leaflet</p>
                        <p><strong>Data Format:</strong> GeoJSON</p>
                        <p><strong>Projection:</strong> Web Mercator (SRID 3857)</p>
                      </div>
                    </CardContent>
                  </Card>
                  <p className="text-xs text-muted-foreground">
                    Built for efficient public transportation management and real-time tracking.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;