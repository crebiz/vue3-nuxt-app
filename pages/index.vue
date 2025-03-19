<template>
  <div>
    <v-card class="mb-4" variant="flat">
      <v-card-title class="text-h4 font-weight-bold">
        Hacker News Top Stories
      </v-card-title>
    </v-card>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      size="64"
      class="ma-4"
    />

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ error }}
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="story in stories"
        :key="story.id"
        cols="12"
      >
        <StoryCard :story="story" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchTopStories, fetchMultipleStories } from '../services/hackerNewsApi';
import type { Story } from '../types/hackerNews';
import StoryCard from '../components/StoryCard.vue';

const stories = ref<Story[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

// Load data when component mounts
onMounted(async () => {
  try {
    // Fetch top story IDs
    const storyIds = await fetchTopStories();
    
    // Fetch details for top 20 stories
    const topStories = await fetchMultipleStories(storyIds, 20);
    
    // Update stories ref
    stories.value = topStories;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load stories';
  } finally {
    loading.value = false;
  }
});
</script>
