
import { useState, useEffect } from "react";
import { Trash2, Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface WatchlistItem {
  id: string;
  movie_id: number;
  movie_title: string;
  movie_poster: string;
  added_at: string;
}

const MyListPage = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    } else {
      navigate("/auth");
    }
  }, [user, navigate]);

  const fetchWatchlist = async () => {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .order('added_at', { ascending: false });

      if (error) throw error;
      setWatchlist(data || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to load your watchlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWatchlist(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Removed",
        description: "Movie removed from your list",
      });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove movie from list",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-8">
          <h1 className="text-3xl font-bold mb-8">My List</h1>
          
          {watchlist.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Your list is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add movies and TV shows to keep track of what you want to watch.
              </p>
              <Button onClick={() => navigate("/")}>
                Browse Movies
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchlist.map((item) => (
                <Card key={item.id} className="group relative overflow-hidden bg-card/50 border-muted hover:scale-105 transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={item.movie_poster || "/placeholder.svg"}
                        alt={item.movie_title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => navigate(`/movie/${item.movie_id}`)}
                            className="bg-white/20 hover:bg-white/30 text-white"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/movie/${item.movie_id}`)}
                            variant="outline"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => removeFromWatchlist(item.id)}
                            variant="destructive"
                            className="bg-red-600/80 hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate">{item.movie_title}</h3>
                      <p className="text-xs text-muted-foreground">
                        Added {new Date(item.added_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthProvider>
  );
};

export default MyListPage;
