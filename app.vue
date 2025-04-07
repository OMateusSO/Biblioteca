<template>
  <div class="flex">
    <!-- Sidebar -->
    <Side />
    
    <!-- Conteúdo Principal -->
    <div class="flex-1 flex flex-col">
      <!-- Navegação -->
      <!-- <Nav /> -->
      
      <!-- Conteúdo da página -->
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
// import Nav from '/components/Nav'
import Side from '/components/Side'
import './assets/css/tailwind.css'
</script>

<style scoped>
/* Ajuste a largura da sidebar se necessário */
</style>
