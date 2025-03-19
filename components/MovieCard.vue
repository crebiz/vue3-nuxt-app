<template>
  <v-container>
    <v-row>
      <v-col v-for="movie in movies" :key="movie.imdbID" cols="12" sm="6" md="4" lg="3">
        <v-card class="mx-auto movie-card" max-width="300" variant="elevated" :disabled="loading" :loading="loading">
          <template #loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate />
          </template>

          <v-img :src="movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'"
            :alt="movie.Title" height="400" cover class="align-end" @click="handleClick(movie)">
            <div class="movie-info">
              <v-card-text class="text-caption pa-2 mb-0 text-center text-amber">
                {{ movie.Year }}
              </v-card-text>
              <v-card-title class="text-caption pa-2 pt-0 text-truncate text-white text-center">
                {{ movie.Title }}
              </v-card-title>
            </div>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { SearchResult } from '../types/omdbMovies';
import { fetchMovieDetails } from '../services/omdbApi';
import { useRouter } from 'vue-router';

defineProps<{
  movies: SearchResult[];
  loading?: boolean;
}>();

const router = useRouter();

const handleClick = (movie: SearchResult) => {
  router.push(`/movie/${movie.imdbID}`);
};
</script>

<style scoped>
.movie-card {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.movie-card:hover {
  transform: translateY(-4px);
}

.movie-info {
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>