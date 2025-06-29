
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/movie/${movie.id}`);
  };

  const handleAddToListClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement add to list functionality
    console.log('Add to list:', movie.title);
  };

  return (
    <div
      className="relative w-64 cursor-pointer card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={movie.poster_path || '/placeholder.svg'}
          alt={movie.title}
          className="w-full h-96 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4">
            <div className="space-y-2">
              <h3 className="font-bold text-white text-lg line-clamp-2">
                {movie.title}
              </h3>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                  {Math.round(movie.vote_average * 10)}% Match
                </Badge>
                <span className="text-white/80 text-sm">
                  {movie.release_date?.split('-')[0]}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-1">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                    onClick={handlePlayClick}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                    onClick={handleAddToListClick}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30">
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
