import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header/Header';
import ApiService from '@/services/api';
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
  const { toast } = useToast();

  const handleApiUrlChange = async (url: string) => {
    ApiService.setBaseURL(url);
    // You might want to add a toast notification here to confirm the change
    toast({ title: "API URL Updated" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onApiUrlChange={handleApiUrlChange} />
      
      <div className="bg-gradient-to-br from-background to-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Marauder's Map Bus Tracking
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Real-time bus tracking system for Tier 2 cities. Choose your interface below to get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Driver Interface Card */}
            <Card className="transition-all hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-primary/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                  <Car className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Driver Interface</CardTitle>
                <CardDescription>Share live location and crowd density updates</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span>Live location sharing</span></div>
                  <div className="flex items-center gap-3"><UsersIcon className="h-4 w-4 text-muted-foreground" /><span>Crowd density reporting</span></div>
                  <div className="flex items-center gap-3"><Bus className="h-4 w-4 text-muted-foreground" /><span>Bus status updates</span></div>
                </div>
                <Button onClick={() => navigate('/driver')} className="w-full">Access Driver Dashboard</Button>
              </CardContent>
            </Card>

            {/* User Interface Card */}
            <Card className="transition-all hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-primary/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                  <UsersIcon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-xl">User Interface</CardTitle>
                <CardDescription>Track buses and get live ETA predictions</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-center gap-3"><Navigation className="h-4 w-4 text-muted-foreground" /><span>Live bus tracking</span></div>
                  <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span>ETA predictions</span></div>
                  <div className="flex items-center gap-3"><UsersIcon className="h-4 w-4 text-muted-foreground" /><span>Crowd density indicators</span></div>
                </div>
                <Button onClick={() => navigate('/user')} className="w-full">Start Tracking Buses</Button>
              </CardContent>
            </Card>

            {/* Admin Interface Card */}
            <Card className="transition-all hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-primary/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Admin Interface</CardTitle>
                <CardDescription>Fleet monitoring and route optimization</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-center gap-3"><Bus className="h-4 w-4 text-muted-foreground" /><span>Fleet monitoring</span></div>
                  <div className="flex items-center gap-3"><Navigation className="h-4 w-4 text-muted-foreground" /><span>Route optimization</span></div>
                  <div className="flex items-center gap-3"><Shield className="h-4 w-4 text-muted-foreground" /><span>Predictive analytics</span></div>
                </div>
                <Button onClick={() => navigate('/admin')} className="w-full">Access Admin Dashboard</Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
