
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MovieCarousel from "@/components/MovieCarousel";
import { AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Movie } from "@/types/movie";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch trending movies
        const { data: trendingData, error: trendingError } = await supabase.functions.invoke('tmdb-search', {
          body: { type: 'trending' }
        });
        if (trendingError) throw trendingError;
        setTrendingMovies(trendingData.results || []);
        
        // Set hero movie from trending
        if (trendingData.results && trendingData.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, trendingData.results.length));
          setHeroMovie(trendingData.results[randomIndex]);
        }

        // Fetch popular movies
        const { data: popularData, error: popularError } = await supabase.functions.invoke('tmdb-search', {
          body: { type: 'popular' }
        });
        if (popularError) throw popularError;
        setPopularMovies(popularData.results || []);

        // Fetch top rated movies
        const { data: topRatedData, error: topRatedError } = await supabase.functions.invoke('tmdb-search', {
          body: { type: 'top_rated' }
        });
        if (topRatedError) throw topRatedError;
        setTopRatedMovies(topRatedData.results || []);

      } catch (error) {
        console.error('Error fetching movies:', error);
        toast({
          title: "Error",
          description: "Failed to load movies. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [toast]);

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
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        
        {heroMovie && <HeroSection movie={heroMovie} />}
        
        <div className="relative -mt-32 z-20">
          {trendingMovies.length > 0 && (
            <MovieCarousel title="Trending Now" movies={trendingMovies} />
          )}
          {popularMovies.length > 0 && (
            <MovieCarousel title="Popular on StreamFlix" movies={popularMovies} />
          )}
          {topRatedMovies.length > 0 && (
            <MovieCarousel title="Top Rated" movies={topRatedMovies} />
          )}
        </div>
        
        <footer className="bg-background/95 border-t border-border mt-16 py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; 2024 StreamFlix. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default Index;
