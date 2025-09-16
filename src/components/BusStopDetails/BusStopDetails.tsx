import React from 'react';
import { MapPin, Route, Hash, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BusStopFeature } from '@/services/api';

interface BusStopDetailsProps {
  busStop: BusStopFeature | null;
  onClose: () => void;
}

const BusStopDetails: React.FC<BusStopDetailsProps> = ({ busStop, onClose }) => {
  if (!busStop) return null;

  const { properties, geometry } = busStop;
  const [lng, lat] = geometry.coordinates;

  const getHighwayBadgeColor = (highway?: string) => {
    switch (highway) {
      case 'primary':
        return 'bg-highway-primary/20 text-highway-primary border-highway-primary/30';
      case 'secondary':
        return 'bg-highway-secondary/20 text-highway-secondary border-highway-secondary/30';
      case 'trunk':
        return 'bg-primary/20 text-primary border-primary/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-card border-border shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-success" />
            Bus Stop Details
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-accent"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stop Name */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-1">
            {properties.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Public Transportation Hub
          </p>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
          <div>
            <span className="text-xs text-muted-foreground">Latitude</span>
            <p className="text-sm font-mono">{lat.toFixed(6)}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Longitude</span>
            <p className="text-sm font-mono">{lng.toFixed(6)}</p>
          </div>
        </div>

        {/* Highway Info */}
        {properties.highway && (
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Highway Type:</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${getHighwayBadgeColor(properties.highway)}`}
            >
              {properties.highway.charAt(0).toUpperCase() + properties.highway.slice(1)}
            </Badge>
          </div>
        )}

        {/* OSM ID */}
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">OSM ID:</span>
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {properties.osm_id}
          </code>
        </div>

        {/* Additional Properties */}
        {Object.entries(properties).map(([key, value]) => {
          if (['name', 'osm_id', 'highway'].includes(key)) return null;
          
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground capitalize">
                {key.replace(/_/g, ' ')}:
              </span>
              <span className="text-sm">{String(value)}</span>
            </div>
          );
        })}

        {/* Actions */}
        <div className="pt-2 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              const url = `https://www.openstreetmap.org/#map=18/${lat}/${lng}`;
              window.open(url, '_blank');
            }}
          >
            View on OpenStreetMap
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              const url = `https://www.google.com/maps?q=${lat},${lng}`;
              window.open(url, '_blank');
            }}
          >
            View on Google Maps
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusStopDetails;