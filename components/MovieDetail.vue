<template>
  <v-container>
    <v-row v-if="movie">
      <v-col cols="12" md="4">
        <v-img :src="movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'"
          :alt="movie.Title" height="500" cover class="rounded-lg" style="border-radius: 10px;" />
      </v-col>
      <v-col cols="12" md="8">
        <v-card variant="flat">
          <v-card-title class="text-h4 font-weight-bold mb-2">
            {{ movie.Title }}
            <span class="text-subtitle-1 ml-2">({{ movie.Year }})</span>
          </v-card-title>

          <v-card-subtitle class="mb-4">
            <v-chip v-if="movie.Rated" color="primary" size="small" class="mr-2">{{ movie.Rated }}</v-chip>
            <span class="mr-2">{{ movie.Released }}</span>
            <span class="mr-2">{{ movie.Runtime }}</span>
            <span>{{ movie.Country }}</span>
          </v-card-subtitle>

          <v-card-text>
            <p>{{ movie.Plot }}</p>

            <v-divider class="my-4"></v-divider>

            <div v-if="movie.Ratings && movie.Ratings.length > 0">
              <div class="text-h6 font-weight-bold mb-2">Ratings</div>
              <v-row class="d-flex align-center">
                <v-col v-for="(rating, index) in movie.Ratings" :key="index" cols="auto" class="pa-2">
                  <v-tooltip :text="`${rating.Source}: ${rating.Value}`" location="top">
                    <template v-slot:activator="{ props }">
                      <v-avatar size="48" v-bind="props" class="elevation-2">
                        <v-img :src="getRatingImageSrc(rating.Source)" :alt="rating.Source" />
                      </v-avatar>
                    </template>
                  </v-tooltip>
                  <div class="text-center mt-1">
                    <strong>{{ rating.Value }}</strong>
                  </div>
                </v-col>
              </v-row>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="mb-4">
              <div class="text-h6 font-weight-bold mb-2">Actors</div>
              <p>{{ movie.Actors }}</p>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="mb-4">
              <div class="text-h6 font-weight-bold mb-2">Director</div>
              <p>{{ movie.Director }}</p>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="mb-4">
              <div class="text-h6 font-weight-bold mb-2">Genre</div>
              <p>{{ movie.Genre }}</p>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" variant="tonal" icon @click="handleBack">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-alert type="error" variant="tonal">
          영화 정보를 불러올 수 없습니다.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { MovieDetails } from '../types/omdbMovies';
import { fetchMovieDetails } from '../services/omdbApi';
import { useMovieSearchStore } from '../stores/movieSearch';

const route = useRoute();
const router = useRouter();
const store = useMovieSearchStore();
const movie = ref<MovieDetails | null>(null);
const loading = ref(true);

// 평점 소스에 따른 이미지 경로 반환 함수
const getRatingImageSrc = (source: string): string => {
  const sourceKey = source.toLowerCase();

  if (sourceKey.includes('internet movie database') || sourceKey.includes('imdb')) {
    return '/internet-movie-database.jpg';
  } else if (sourceKey.includes('rotten tomatoes')) {
    return '/rotten-tomatoes.jpg';
  } else if (sourceKey.includes('metacritic')) {
    return '/metacritic.jpg';
  }

  // 기본 이미지 반환
  return '/placeholder-movie.jpg';
};

const handleBack = () => {
  if (store.lastSearch) {
    router.push({
      path: '/omdb',
      query: {
        ...store.lastSearch,
        restore: 'true'
      }
    });
  } else {
    router.back();
  }
};

onMounted(async () => {
  const id = route.params.id as string;
  if (id) {
    try {
      const details = await fetchMovieDetails(id);
      movie.value = details;
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>