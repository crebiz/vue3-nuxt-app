<template>
  <v-card variant="outlined" class="mb-2" elevation="1" hover>
    <v-card-title>
      <a :href="story.url" target="_blank" class="text-decoration-none">
        {{ story.title }}
      </a>
    </v-card-title>
    
    <v-card-text>
      <v-row align="center" no-gutters>
        <v-chip
          size="small"
          color="primary"
          variant="tonal"
          class="mr-2"
        >
          {{ story.score }} points
        </v-chip>
        
        <v-chip
          size="small"
          color="secondary"
          variant="tonal"
          class="mr-2"
        >
          by {{ story.by }}
        </v-chip>
        
        <v-chip
          size="small"
          color="info"
          variant="tonal"
        >
          {{ formattedDate }}
        </v-chip>
      </v-row>
    </v-card-text>
    
    <v-card-actions>
      <v-btn
        variant="text"
        color="primary"
        :href="story.url"
        target="_blank"
        prepend-icon="mdi-open-in-new"
      >
        Read More
      </v-btn>
      
      <v-btn
        variant="text"
        color="secondary"
        :href="`https://news.ycombinator.com/item?id=${story.id}`"
        target="_blank"
        prepend-icon="mdi-comment-outline"
      >
        Comments
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Story } from '../types/hackerNews';

const props = defineProps<{
  story: Story
}>();

const formattedDate = computed(() => {
  const date = new Date(props.story.time * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});
</script>
