import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header/Header';
import BusMap from '@/components/Map/BusMap';
import SearchBar from '@/components/Search/SearchBar';
import FilterPanel from '@/components/Filters/FilterPanel';
import BusStopDetails from '@/components/BusStopDetails/BusStopDetails';
import ApiService, { BusStopsGeoJSON, BusStopFeature } from '@/services/api';
import { 
  Car, 
  Users as UsersIcon, 
  Shield, 
  MapPin, 
  Bus,
  Navigation
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [busStops, setBusStops] = useState<BusStopsGeoJSON>({ type: 'FeatureCollection', features: [] });
  const [originalBusStops, setOriginalBusStops] = useState<BusStopsGeoJSON>({ type: 'FeatureCollection', features: [] });
  const [selectedBusStop, setSelectedBusStop] = useState<BusStopFeature | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ highway?: string }>({});
  const { toast } = useToast();

  // Load bus stops on component mount
  useEffect(() => {
    loadBusStops();
  }, []);

  const loadBusStops = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getBusStops();
      setBusStops(data);
      setOriginalBusStops(data);
      toast({
        title: "Bus stops loaded",
        description: `Found ${data.features.length} bus stops`,
      });
    } catch (error) {
      toast({
        title: "Error loading bus stops",
        description: "Using mock data for demonstration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setBusStops(originalBusStops);
      return;
    }

    try {
      const searchResults = await ApiService.searchBusStops(query);
      setBusStops(searchResults);
      toast({
        title: "Search completed",
        description: `Found ${searchResults.features.length} matching bus stops`,
      });
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setBusStops(originalBusStops);
  };

  const handleHighwayFilter = async (highway: string | null) => {
    const newFilters = { ...activeFilters };
    if (highway) {
      newFilters.highway = highway;
    } else {
      delete newFilters.highway;
    }
    setActiveFilters(newFilters);

    try {
      const filteredResults = await ApiService.filterBusStops(highway);
      setBusStops(filteredResults);
      toast({
        title: highway ? "Filter applied" : "Filter cleared",
        description: `Showing ${filteredResults.features.length} bus stops`,
      });
    } catch (error) {
      toast({
        title: "Filter failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setBusStops(originalBusStops);
    toast({
      title: "Filters cleared",
      description: `Showing all ${originalBusStops.features.length} bus stops`,
    });
  };

  const handleBusStopSelect = (busStop: BusStopFeature) => {
    setSelectedBusStop(busStop);
  };

  const handleCloseBusStopDetails = () => {
    setSelectedBusStop(null);
  };

  const handleApiUrlChange = (url: string) => {
    loadBusStops(); // Reload with new API URL
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header onApiUrlChange={handleApiUrlChange} />
      
      {/* Hero Section - Interface Selection */}
      <div className="bg-gradient-to-br from-background to-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Marauder's Map Bus Tracking
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time bus tracking system for Tier 2 cities. Choose your interface below to get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Driver Interface */}
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Driver Interface</CardTitle>
                <CardDescription className="text-sm">
                  Share live location and crowd density updates
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Live location sharing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Crowd density reporting</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Bus className="h-4 w-4 text-muted-foreground" />
                    <span>Bus status updates</span>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/driver')} 
                  className="w-full"
                >
                  Access Driver Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* User Interface */}
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <UsersIcon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">User Interface</CardTitle>
                <CardDescription className="text-sm">
                  Track buses and get live ETA predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                    <span>Live bus tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>ETA predictions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Crowd density indicators</span>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/user')} 
                  className="w-full"
                >
                  Start Tracking Buses
                </Button>
              </CardContent>
            </Card>

            {/* Admin Interface */}
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Admin Interface</CardTitle>
                <CardDescription className="text-sm">
                  Fleet monitoring and route optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Bus className="h-4 w-4 text-muted-foreground" />
                    <span>Fleet monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                    <span>Route optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Predictive analytics</span>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/admin')} 
                  className="w-full"
                >
                  Access Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Sidebar - Search & Filters */}
          <div className="lg:col-span-1 space-y-4 lg:max-h-full lg:overflow-y-auto">
            {/* Search */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Search</h2>
              <SearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
                value={searchQuery}
                placeholder="Find bus stops..."
              />
            </div>

            {/* Filters */}
            <FilterPanel
              onHighwayFilter={handleHighwayFilter}
              onClearFilters={handleClearFilters}
              activeFilters={activeFilters}
              busStopCount={busStops.features.length}
            />

            {/* Bus Stop Details */}
            {selectedBusStop && (
              <div className="mt-4">
                <BusStopDetails
                  busStop={selectedBusStop}
                  onClose={handleCloseBusStopDetails}
                />
              </div>
            )}
          </div>

          {/* Map Section */}
          <div className="lg:col-span-3 relative">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-card rounded-lg border border-border">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading bus stops...</p>
                </div>
              </div>
            ) : (
              <BusMap
                busStops={busStops}
                onBusStopSelect={handleBusStopSelect}
                center={[12.9716, 77.5946]} // Default to Bangalore
                zoom={13}
              />
            )}
            
            {/* Map Overlay Info */}
            <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Bus Stops</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {busStops.features.length} stops displayed
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;