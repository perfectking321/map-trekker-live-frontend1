import React from 'react';
import { Filter, MapPin, Route } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterPanelProps {
  onHighwayFilter: (highway: string | null) => void;
  onClearFilters: () => void;
  activeFilters: {
    highway?: string;
  };
  busStopCount?: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  onHighwayFilter, 
  onClearFilters, 
  activeFilters,
  busStopCount = 0
}) => {
  const handleHighwayChange = (value: string) => {
    if (value === 'all') {
      onHighwayFilter(null);
    } else {
      onHighwayFilter(value);
    }
  };

  const hasActiveFilters = Object.keys(activeFilters).some(key => 
    activeFilters[key as keyof typeof activeFilters]
  );

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Filter className="w-4 h-4 text-primary" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bus Stop Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-success" />
            <span className="text-sm text-muted-foreground">Bus Stops</span>
          </div>
          <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
            {busStopCount}
          </Badge>
        </div>

        {/* Highway Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Route className="w-4 h-4 text-highway-primary" />
            Highway Type
          </label>
          <Select onValueChange={handleHighwayChange} defaultValue="all">
            <SelectTrigger className="w-full bg-input border-border">
              <SelectValue placeholder="Select highway type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Highways</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="trunk">Trunk</SelectItem>
              <SelectItem value="tertiary">Tertiary</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Active Filters:</span>
            <div className="flex flex-wrap gap-1">
              {activeFilters.highway && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-primary text-primary bg-primary/10"
                >
                  Highway: {activeFilters.highway}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Clear All Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterPanel;