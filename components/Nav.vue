<template>
  <div>
    <!-- Conteúdo principal -->
    <div class="flex-1 flex flex-col">
      <nav class="flex items-center justify-between p-4 sm:px-16 bg-white shadow-md">
        <RouterLink to="/" class="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition">
          Biblioteca
        </RouterLink>
        <!-- Botão para abrir a sidebar -->
        <button @click="toggleSidebar" class="text-gray-600 focus:outline-none md:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </nav>
      <div class="border-t border-gray-300"></div>

      <!-- Área de conteúdo -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>

<style scoped>
/* Sidebar sempre visível em telas grandes */
@media (min-width: 768px) {
  aside {
    transform: translateX(0) !important;
  }
}
</style>
