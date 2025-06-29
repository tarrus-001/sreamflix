
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  video: boolean;
  vote_count: number;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export class TMDBService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchMovies(query: string, page = 1): Promise<TMDBResponse> {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}`
    );
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    return response.json();
  }

  async getPopularMovies(page = 1): Promise<TMDBResponse> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${this.apiKey}&page=${page}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch popular movies');
    }
    return response.json();
  }

  async getTrendingMovies(page = 1): Promise<TMDBResponse> {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${this.apiKey}&page=${page}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch trending movies');
    }
    return response.json();
  }

  async getTopRatedMovies(page = 1): Promise<TMDBResponse> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${this.apiKey}&page=${page}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch top rated movies');
    }
    return response.json();
  }

  getImageUrl(path: string | null): string {
    if (!path) return '/placeholder.svg';
    return `${IMAGE_BASE_URL}${path}`;
  }
}
