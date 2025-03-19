import { defineStore } from 'pinia';

interface SearchFilters {
  query: string;
  type: string;
  limit: number;
  year: string;
}

interface MovieSearchState {
  filters: SearchFilters;
  lastSearch: SearchFilters | null;
}

export const useMovieSearchStore = defineStore('movieSearch', {
  state: (): MovieSearchState => ({
    filters: {
      query: '',
      type: 'movie',
      limit: 10,
      year: 'All Years'
    },
    lastSearch: null
  }),

  actions: {
    setFilters(filters: SearchFilters) {
      this.filters = { ...filters };
      this.lastSearch = { ...filters };
    },
    
    resetFilters() {
      this.filters = {
        query: '',
        type: 'movie',
        limit: 10,
        year: 'All Years'
      };
      this.lastSearch = null;
    }
  }
});
