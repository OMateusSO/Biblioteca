<template>
  <div class="flex items-center justify-center min-h-screen p-8 bg-gray-100">
    <!-- Card de Empréstimos -->
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Empréstimos</h1>
        <button @click="showModal = true" class="bg-blue-600 text-white p-2 flex items-center justify-center text-xl">
          Adicionar
        </button>
      </div>

      <!-- Barra de Pesquisa -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar empréstimo por livro ou aluno..."
        class="w-full p-2 border rounded mb-4"
      />

      <!-- Lista de Empréstimos -->
      <ul v-if="paginatedLoans.length" class="space-y-2">
        <li v-for="loan in paginatedLoans" :key="loan.id" class="p-2 border rounded flex justify-between">
          <span>{{ loan.aluno }} pegou "{{ loan.livro }}" em {{ loan.dataEmprestimo }}</span>
          <span class="text-sm text-gray-500">Devolução: {{ loan.dataDevolucao || 'Pendente' }}</span>
        </li>
      </ul>
      <p v-else class="text-gray-500 text-center">Nenhum empréstimo encontrado.</p>

      <!-- Paginação -->
      <div v-if="totalPages > 1" class="flex justify-between items-center mt-4">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Anterior
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Próximo
        </button>
      </div>
    </div>

    <!-- Modal de Empréstimo -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Novo Empréstimo</h2>
        <form @submit.prevent="addLoan">
          <div class="grid grid-cols-1 gap-4">
            <input v-model="newLoan.aluno" type="text" placeholder="Nome do aluno" class="p-2 border rounded" required />
            <input v-model="newLoan.livro" type="text" placeholder="Título do livro" class="p-2 border rounded" required />
            <p>Emprestimo</p>
            <input v-model="newLoan.dataEmprestimo" type="date" class="p-2 border rounded" required />
            <p>Devolução</p>
            <input v-model="newLoan.dataDevolucao" type="date" class="p-2 border rounded" />
          </div>
          <div class="flex justify-between mt-4">
            <button type="button" @click="showModal = false" class="p-2 bg-gray-400 text-white rounded">Cancelar</button>
            <button type="submit" class="p-2 bg-blue-600 text-white rounded">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      newLoan: { aluno: "", livro: "", dataEmprestimo: "", dataDevolucao: "" },
      loans: [], // Simulação do banco de dados local
      showModal: false,
      currentPage: 1,
      itemsPerPage: 9,
    };
  },
  computed: {
    filteredLoans() {
      return this.loans.filter(loan =>
        loan.aluno.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        loan.livro.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredLoans.length / this.itemsPerPage);
    },
    paginatedLoans() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredLoans.slice(start, start + this.itemsPerPage);
    }
  },
  methods: {
    addLoan() {
      if (!this.newLoan.aluno || !this.newLoan.livro || !this.newLoan.dataEmprestimo) return;
      const newEntry = { ...this.newLoan, id: Date.now() };
      this.loans.push(newEntry);
      this.newLoan = { aluno: "", livro: "", dataEmprestimo: "", dataDevolucao: "" };
      this.showModal = false;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    }
  }
};
</script>
