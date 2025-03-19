<template>
  <v-app>
    <v-app-bar elevation="2">
      <v-app-bar-title>News & Movies</v-app-bar-title>
      <v-tabs v-model="activeTab">
        <v-tab value="hacker-news" to="/">Hacker News</v-tab>
        <v-tab value="omdb" to="/omdb">OMDB</v-tab>
      </v-tabs>
      <v-spacer />
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-brightness-7' : 'mdi-brightness-4' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>

    <v-footer app>
      <v-row justify="center" no-gutters>
        <span>&copy; {{ new Date().getFullYear() }} - News & Movies App</span>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { ref } from 'vue'

const theme = useTheme()
const isDark = ref(theme.global.current.value.dark)
const activeTab = ref('hacker-news')

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
  isDark.value = !isDark.value
}
</script>
