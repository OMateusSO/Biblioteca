<template>
  <div>
    <!-- Sidebar -->
    <div
      :class="[
        'fixed left-0 top-0 h-full w-64 bg-gray-800 text-white transform transition-transform md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-64'
      ]"
    >
      <div class="p-4 text-xl font-bold border-b border-gray-700 flex justify-between items-center">
        <div class="p-0.5">
          <NuxtLink to="/">Biblioteca</NuxtLink>
        </div>
        <button @click="toggleSidebar" class="text-white md:hidden">
        </button>
      </div>
      <nav class="mt-4">
        <NuxtLink to="/livros" class="block px-4 py-2 hover:bg-gray-700">📚 Livros</NuxtLink>
        <NuxtLink to="/emprestimos" class="block px-4 py-2 hover:bg-gray-700">📖 Empréstimos</NuxtLink>
        <NuxtLink to="/alunos" class="block px-4 py-2 hover:bg-gray-700">👤 Aluno</NuxtLink>
      </nav>
    </div>

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
