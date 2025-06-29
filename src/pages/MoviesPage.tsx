
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Movie } from "@/types/movie";
import { useToast } from "@/hooks/use-toast";

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const categories = [
    { value: "popular", label: "Popular" },
    { value: "trending", label: "Trending" },
    { value: "top_rated", label: "Top Rated" },
  ];

  useEffect(() => {
    fetchMovies();
  }, [selectedCategory, page]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('tmdb-search', {
        body: { type: selectedCategory, page }
      });

      if (error) throw error;
      
      if (page === 1) {
        setMovies(data.results || []);
      } else {
        setMovies(prev => [...prev, ...(data.results || [])]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast({
        title: "Error",
        description: "Failed to load movies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Movies</h1>
            
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48 bg-card/50 border-muted">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm border border-muted">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && page === 1 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movies.map((movie) => (
                  <MovieCard key={`${movie.id}-${page}`} movie={movie} />
                ))}
              </div>
              
              {movies.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={loadMore} 
                    disabled={loading}
                    variant="outline"
                    className="bg-card/50 border-muted hover:bg-card"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AuthProvider>
  );
};

export default MoviesPage;
