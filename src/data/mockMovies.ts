
import { Movie } from "@/types/movie";

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
    poster_path: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop",
    release_date: "2008-07-18",
    vote_average: 9.0,
    genre_ids: [28, 80, 18],
    adult: false,
    original_language: "en",
    popularity: 85.5,
    video: false,
    vote_count: 29000
  },
  {
    id: 2,
    title: "Inception",
    overview: "A skilled thief is given a chance at redemption if he can successfully perform inception.",
    poster_path: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=600&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop",
    release_date: "2010-07-16",
    vote_average: 8.8,
    genre_ids: [28, 878, 53],
    adult: false,
    original_language: "en",
    popularity: 83.2,
    video: false,
    vote_count: 32000
  },
  {
    id: 3,
    title: "The Matrix",
    overview: "A computer programmer discovers reality isn't what it seems and joins a rebellion against machines.",
    poster_path: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=600&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1920&h=1080&fit=crop",
    release_date: "1999-03-31",
    vote_average: 8.7,
    genre_ids: [28, 878],
    adult: false,
    original_language: "en",
    popularity: 79.8,
    video: false,
    vote_count: 25000
  },
  {
    id: 4,
    title: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence.",
    poster_path: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1920&h=1080&fit=crop",
    release_date: "1994-10-14",
    vote_average: 8.9,
    genre_ids: [80, 18],
    adult: false,
    original_language: "en",
    popularity: 81.3,
    video: false,
    vote_count: 27000
  },
  {
    id: 5,
    title: "Interstellar",
    overview: "Earth's future depends on a secret NASA mission to find humanity a new home among the stars.",
    poster_path: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=600&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1920&h=1080&fit=crop",
    release_date: "2014-11-07",
    vote_average: 8.6,
    genre_ids: [18, 878],
    adult: false,
    original_language: "en",
    popularity: 78.9,
    video: false,
    vote_count: 24000
  }
];

export const trendingMovies = mockMovies.slice(0, 3);
export const popularMovies = [...mockMovies].sort((a, b) => b.popularity - a.popularity);
export const topRatedMovies = [...mockMovies].sort((a, b) => b.vote_average - a.vote_average);
