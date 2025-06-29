
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const TVShowsPage = () => {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Coming Soon",
      description: "TV Shows functionality will be available soon!",
    });
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-6">TV Shows</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Coming Soon! We're working on bringing you the best TV shows.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default TVShowsPage;
