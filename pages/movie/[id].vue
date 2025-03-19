<template>
  <div>
    <v-card class="mb-4" variant="flat">
      <v-card-title class="text-h4 font-weight-bold">
        영화 상세정보
      </v-card-title>
    </v-card>
    
    <MovieDetail />
  </div>
</template>

<script setup lang="ts">
import MovieDetail from '../../components/MovieDetail.vue';
</script>
