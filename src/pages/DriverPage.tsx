import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DriverPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-border shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Driver Dashboard</h1>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Driver Interface coming soon...</p>
      </main>
    </div>
  );
};

export default DriverPage;
