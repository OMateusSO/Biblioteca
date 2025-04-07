<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div
      :class="['bg-gray-900 text-white flex flex-col p-4 transition-all duration-300', isCollapsed ? 'w-20' : 'w-64']"
    >
      <!-- Botão de Expandir/Recolher -->
      <button @click="toggleSidebar" class="mb-6 self-end p-2 text-gray-300 hover:text-white">
        <i :class="[isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left']"></i>
      </button>

      <!-- Logo -->
      <div class="flex items-center mb-8">
        <span v-if="!isCollapsed">
          <RouterLink to="/" class="ml-3 text-2xl font-bold text-indigo-400">
            Biblioteca
          </RouterLink>
        </span>
      </div>

      <!-- Links -->
      <nav class="space-y-4">
        <NuxtLink
          to="/livros"
          class="flex items-center p-3 rounded-lg transition duration-300 hover:bg-gray-700"
        >
          <i class="fas fa-book mr-3"></i>
          <span v-if="!isCollapsed">Livros</span>
        </NuxtLink>

        <NuxtLink
          to="/emprestimos"
          class="flex items-center p-3 rounded-lg transition duration-300 hover:bg-gray-700"
        >
          <i class="fas fa-hand-holding text-lg mr-3"></i>
          <span v-if="!isCollapsed">Empréstimos</span>
        </NuxtLink>

        <NuxtLink
          to="/alunos"
          class="flex items-center p-3 rounded-lg transition duration-300 hover:bg-gray-700"
        >
          <i class="fas fa-user-graduate text-lg mr-3"></i>
          <span v-if="!isCollapsed">Alunos</span>
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style scoped>
/* Estilos gerais da sidebar */
a {
  @apply text-gray-300 hover:text-white transition-colors;
}
</style>
