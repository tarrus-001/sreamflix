
import { useState, useEffect } from "react";
import { Play, Plus, Volume, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Movie } from "@/types/movie";

interface HeroSectionProps {
  movie: Movie;
}

const HeroSection = ({ movie }: HeroSectionProps) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${movie.backdrop_path})`,
        }}
      />
      
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            {movie.title}
          </h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="secondary" className="bg-green-600 text-white">
              {Math.round(movie.vote_average * 10)}% Match
            </Badge>
            <span className="text-white/80">{movie.release_date?.split('-')[0]}</span>
            <Badge variant="outline" className="border-white/50 text-white">
              HD
            </Badge>
          </div>
          
          <p className="text-lg text-white/90 mb-8 line-clamp-3">
            {movie.overview}
          </p>
          
          <div className="flex items-center space-x-4">
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              <Play className="h-5 w-5 mr-2" />
              Play
            </Button>
            
            <Button size="lg" variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              <Plus className="h-5 w-5 mr-2" />
              My List
            </Button>
            
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/20 ml-auto"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
