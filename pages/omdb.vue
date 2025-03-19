<template>
  <div>
    <v-card class="mb-4" variant="flat">
      <v-card-title class="text-h4 font-weight-bold">
        OMDB Movie Search
      </v-card-title>
    </v-card>

    <MovieSearch :loading="loading" @search="handleSearch" />

    <client-only>
      <div v-if="sortedMovies.length > 0" class="position-relative">
        <v-progress-linear v-if="loading" color="primary" height="4" indeterminate class="loading-bar" />
        <MovieCard :movies="sortedMovies" :loading="loading" />
      </div>

      <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4">
        {{ error }}
      </v-alert>

      <v-alert v-else-if="!loading" type="info" variant="tonal" class="mb-4">
        No movies found
      </v-alert>

      <template #fallback>
        <div class="d-flex justify-center align-center py-8">
          <v-progress-circular indeterminate color="primary" />
        </div>
      </template>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchMovies } from '../services/omdbApi';
import type { SearchResult } from '../types/omdbMovies';
import MovieCard from '../components/MovieCard.vue';
import MovieSearch from '../components/MovieSearch.vue';
import { useMovieSearchStore } from '../stores/movieSearch';

interface SearchFilters {
  type: string;
  limit: number;
  year: string;
}

const route = useRoute();
const store = useMovieSearchStore();
const movies = ref<SearchResult[]>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const sortedMovies = computed(() => {
  return [...movies.value].sort((a, b) => {
    const yearA = parseInt(a.Year, 10);
    const yearB = parseInt(b.Year, 10);
    return yearB - yearA; // 최신 연도순으로 정렬
  });
});

const handleSearch = async (query: string, filters: SearchFilters) => {
  loading.value = true;
  error.value = null;

  try {
    const totalPages = Math.ceil(filters.limit / 10);
    const allResults: SearchResult[] = [];
    let hasError = false;

    for (let page = 1; page <= totalPages; page++) {
      const { results, hasError: pageError } = await fetchMovies({
        query,
        type: filters.type,
        year: filters.year === 'All Years' ? '' : filters.year,
        page,
      });

      if (pageError) {
        hasError = true;
        break;
      }

      if (results.length === 0 && page > 1) {
        break;
      }

      allResults.push(...results);
    }

    if (hasError) {
      error.value = 'Failed to fetch movies. Please try again.';
      return;
    }

    movies.value = allResults.slice(0, filters.limit);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load movies';
  } finally {
    loading.value = false;
  }
};

// 이전 검색 상태 복원
onMounted(() => {
  const query = route.query;
  if (query.restore === 'true' && store.lastSearch) {
    handleSearch(store.lastSearch.query, {
      type: store.lastSearch.type,
      limit: store.lastSearch.limit,
      year: store.lastSearch.year
    });
  }
});
</script>

<style scoped>
.position-relative {
  position: relative;
}

.loading-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>
