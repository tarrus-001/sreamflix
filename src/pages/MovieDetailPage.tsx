
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Plus, Star, ArrowLeft, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Movie } from "@/types/movie";
import { useToast } from "@/hooks/use-toast";

interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
      fetchMovieVideos();
    }
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('tmdb-movie-details', {
        body: { movieId: id }
      });

      if (error) throw error;
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      toast({
        title: "Error",
        description: "Failed to load movie details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieVideos = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('tmdb-movie-videos', {
        body: { movieId: id }
      });

      if (error) throw error;
      setVideos(data.results || []);
    } catch (error) {
      console.error('Error fetching movie videos:', error);
    }
  };

  const getTrailer = () => {
    return videos.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    ) || videos.find(video => video.site === 'YouTube');
  };

  const handleDownload = () => {
    toast({
      title: "Download Not Available",
      description: "Movie downloads are not available due to copyright restrictions. Please use legal streaming services.",
      variant: "destructive",
    });
  };

  if (loading) {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </AuthProvider>
    );
  }

  if (!movie) {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </div>
      </AuthProvider>
    );
  }

  const trailer = getTrailer();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="relative">
          <div
            className="h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${movie.backdrop_path})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            
            <div className="absolute top-20 left-8 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                  {movie.title}
                </h1>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    {Math.round(movie.vote_average * 10)}% Match
                  </Badge>
                  <span className="text-white/80">{movie.release_date?.split('-')[0]}</span>
                  <Badge variant="outline" className="border-white/50 text-white">
                    HD
                  </Badge>
                </div>
                
                <p className="text-lg text-white/90 mb-8 max-w-2xl">
                  {movie.overview}
                </p>
                
                <div className="flex items-center space-x-4">
                  {trailer ? (
                    <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
                      <DialogTrigger asChild>
                        <Button size="lg" className="bg-white text-black hover:bg-white/90">
                          <Play className="h-5 w-5 mr-2" />
                          Play Trailer
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-full p-0">
                        <div className="relative aspect-video">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
                            onClick={() => setIsTrailerOpen(false)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                          <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                            title={trailer.name}
                            className="w-full h-full rounded-lg"
                            allowFullScreen
                            allow="autoplay; encrypted-media"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button size="lg" className="bg-white text-black hover:bg-white/90" disabled>
                      <Play className="h-5 w-5 mr-2" />
                      No Trailer Available
                    </Button>
                  )}
                  
                  <Button size="lg" variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    <Plus className="h-5 w-5 mr-2" />
                    My List
                  </Button>

                  <Button size="lg" variant="secondary" className="bg-white/20 text-white hover:bg-white/30" onClick={handleDownload}>
                    <Download className="h-5 w-5 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About this movie</h2>
              <p className="text-muted-foreground mb-6">{movie.overview}</p>
              
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-muted-foreground w-24">Released:</span>
                  <span>{movie.release_date}</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">Rating:</span>
                  <span>{movie.vote_average}/10</span>
                </div>
                <div className="flex">
                  <span className="text-muted-foreground w-24">Language:</span>
                  <span className="uppercase">{movie.original_language}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">More Like This</h3>
              <div className="text-muted-foreground">
                Similar movies will be shown here.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default MovieDetailPage;
