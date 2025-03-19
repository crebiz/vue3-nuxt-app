<template>
  <v-card variant="outlined" class="mb-4">
    <v-card-text>
      <v-form @submit.prevent="handleSearch">
        <v-row align="center">
          <v-col cols="12" sm="4">
            <v-text-field v-model="filters.query" label="Search Movies" variant="outlined" density="comfortable"
              hide-details :loading="loading" :disabled="loading" clearable />
          </v-col>
          <v-col cols="12" sm="2">
            <v-select v-model="filters.type" :items="typeOptions" label="Type" variant="outlined" density="comfortable"
              hide-details :disabled="loading" />
          </v-col>
          <v-col cols="12" sm="2">
            <v-select v-model="filters.limit" :items="limitOptions" label="Results" variant="outlined"
              density="comfortable" hide-details :disabled="loading" />
          </v-col>
          <v-col cols="12" sm="2">
            <v-select v-model="filters.year" :items="yearOptions" label="Year" variant="outlined" density="comfortable"
              hide-details :disabled="loading" />
          </v-col>
          <v-col cols="12" sm="2">
            <v-btn block color="primary" type="submit" :loading="loading" :disabled="!filters.query || loading">
              Search
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMovieSearchStore } from '../stores/movieSearch';

interface Props {
  loading?: boolean;
}

const { loading: isLoading } = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  (e: 'search', query: string, filters: { type: string; limit: number; year: string }): void;
}>();

const store = useMovieSearchStore();
const filters = computed(() => store.filters);

const currentYear = new Date().getFullYear();
const typeOptions = ['movie', 'series', 'episode'];
const limitOptions = [10, 20, 30];
const yearOptions = computed(() => {
  const years = ['All Years'];
  for (let year = currentYear; year >= currentYear - 30; year--) {
    years.push(year.toString());
  }
  return years;
});

const handleSearch = () => {
  if (filters.value.query) {
    store.setFilters(filters.value);
    emit('search', filters.value.query, {
      type: filters.value.type,
      limit: filters.value.limit,
      year: filters.value.year
    });
  }
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