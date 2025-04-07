<template>
  <div class="flex items-center justify-center min-h-screen p-8 bg-gray-200">
    <div class="bg-white shadow-xl rounded-lg p-6 max-w-4xl w-full">
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-6">📊 Dashboard</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <!-- Empréstimos Mensais -->
        <div
          class="p-6 bg-white rounded-lg shadow-md flex flex-col items-center border border-gray-300 transition hover:shadow-lg">
          <h2 class="text-lg font-bold text-gray-700">📚 Empréstimos</h2>
          <p class="text-3xl font-semibold text-blue-600">{{ emprestimosMensais }}</p>
        </div>

        <!-- Livros Cadastrados -->
        <div
          class="p-6 bg-white rounded-lg shadow-md flex flex-col items-center border border-gray-300 transition hover:shadow-lg">
          <h2 class="text-lg font-bold text-gray-700">📖 Livros Cadastrados</h2>
          <p class="text-3xl font-semibold text-green-600">{{ acervosCadastrados }}</p>
        </div>

        <!-- Alunos Cadastrados -->
        <div
          class="p-6 bg-white rounded-lg shadow-md flex flex-col items-center border border-gray-300 transition hover:shadow-lg">
          <h2 class="text-lg font-bold text-gray-700">🎓 Alunos Cadastrados</h2>
          <p class="text-3xl font-semibold text-purple-600">{{ alunosCadastrados }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emprestimosMensais: 0,
      acervosCadastrados: 0,
      alunosCadastrados: 0
    };
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const [emprestimosRes, acervosRes, alunosRes] = await Promise.all([
          fetch("/api/emprestimo/mensais").then(res => res.json()),
          fetch("/api/livros/contagem").then(res => res.json()),
          fetch("/api/alunos/contagem").then(res => res.json()),
        ]);

        this.emprestimosMensais = emprestimosRes.emprestimosMensais || 0;
        this.acervosCadastrados = acervosRes.acervosCadastrados || 0;
        this.alunosCadastrados = alunosRes.alunosCadastrados || 0;
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
  }
};
</script>


<style scoped>
/* Ajustes de responsividade específicos para telas menores */
@media (max-width: 640px) {
  .bg-white {
    padding: 4px;
    /* Menos padding em telas pequenas */
  }
}

@media (max-width: 768px) {
  .text-2xl {
    font-size: 1.5rem;
    /* Tamanho de fonte um pouco menor em tablets */
  }

  .text-3xl {
    font-size: 1.875rem;
    /* Ajuste de texto maior para telas médias */
  }
}
</style>
