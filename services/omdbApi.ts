import type { SearchResponse, SearchResult, MovieDetails } from '../types/omdbMovies';

const API_KEY: string = '7035c60c';
const API_BASE_URL: string = 'https://www.omdbapi.com/';

interface SearchParams {
  query: string;
  type?: string;
  year?: string;
  page?: number;
}

export const fetchMovies = async ({ query, type, year, page = 1 }: SearchParams): Promise<{ results: SearchResult[]; hasError: boolean }> => {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      s: query,
      page: page.toString(),
    });

    if (type) {
      params.append('type', type);
    }

    if (year) {
      params.append('y', year);
    }

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      return { results: [], hasError: true };
    }
    const data = await response.json() as SearchResponse;
    if (data.Response === 'False') {
      return { results: [], hasError: false };
    }
    
    // Ensure consistent data structure for server and client rendering
    const processedResults = data.Search.map(movie => ({
      ...movie,
      // Ensure Poster is never undefined or 'N/A'
      Poster: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg',
      // Ensure Year is always a string
      Year: movie.Year ? movie.Year.toString() : '',
      // Ensure imdbID is always a string
      imdbID: movie.imdbID ? movie.imdbID.toString() : `id-${Math.random().toString(36).substring(2, 9)}`
    }));
    
    return { results: processedResults, hasError: false };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { results: [], hasError: true };
  }
};

export const fetchMovieDetails = async (id: string): Promise<MovieDetails | null> => {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      i: id,
    });

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json() as MovieDetails;
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};
