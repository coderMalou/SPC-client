<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TopBar from './components/TopBar.vue';
</script>

<template>
  <div class="app-container">
    <TopBar />
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style>
body {
  width: 100%;
  height: 100%;
  margin: 0;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.app-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.main-content {
  width: 100%;
  height: calc(100% - 60px);
  margin: 60px auto;
  position: relative;
}
</style>
