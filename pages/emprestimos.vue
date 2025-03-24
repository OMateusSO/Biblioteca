<template>
  <div class="flex items-center justify-center min-h-screen p-8 bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Empréstimos</h1>
        <button @click="showModal = true" class="bg-blue-600 text-white p-2 flex items-center justify-center text-xl">
          Adicionar
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b">
        <ul class="flex">
          <li @click="activeTab = 'pendentes'"
            :class="activeTab === 'pendentes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'"
            class="cursor-pointer p-2">Pendentes</li>
          <li @click="activeTab = 'atrasados'"
            :class="activeTab === 'atrasados' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'"
            class="cursor-pointer p-2">Atrasados</li>
        </ul>
      </div>

      <!-- Barra de Pesquisa -->
      <input v-model="searchQuery" type="text" placeholder="Buscar empréstimo por livro ou aluno..."
        class="w-full p-2 border rounded my-4" />

      <!-- Lista de Empréstimos -->
      <ul v-if="paginatedLoans.length" class="space-y-4">
        <li v-for="loan in paginatedLoans" :key="loan.id"
          class="p-4 bg-white rounded-lg shadow-md flex justify-between items-center border border-gray-200">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ loan.aluno }}</h3>
            <p class="text-sm text-gray-600">
              Pegou: <span class="font-medium">"{{ loan.livro }}"</span> em
              <span class="font-medium">{{ formatDate(loan.dataEmprestimo) }}</span>
            </p>
          </div>
          <div class="text-right text-sm">
            <p>Devolução:
              <span :class="isLate(loan) ? 'text-red-500 font-medium' : 'text-gray-700'">
                {{ loan.dataDevolucao ? formatDate(loan.dataDevolucao) : formatDate(loan.dataProgramada) }}
              </span>
            </p>
          </div>
        </li>
      </ul>

      <p v-else class="text-gray-500 text-center">Nenhum empréstimo encontrado.</p>

      <!-- Paginação -->
      <div v-if="totalPages > 1" class="flex justify-between items-center mt-4">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Anterior
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
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
            <input v-model="newLoan.aluno" type="text" placeholder="Nome do aluno" class="p-2 border rounded"
              required />
            <input v-model="newLoan.livro" type="text" placeholder="Título do livro" class="p-2 border rounded"
              required />
            <p>Emprestimo</p>
            <input v-model="newLoan.dataEmprestimo" type="date" class="p-2 border rounded" required />
            <p>Devolução Programada</p>
            <input v-model="newLoan.dataProgramada" type="date" class="p-2 border rounded" required />
          </div>
          <div class="flex justify-between mt-4">
            <button type="button" @click="showModal = false"
              class="p-2 bg-gray-400 text-white rounded">Cancelar</button>
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
      activeTab: "pendentes",
      searchQuery: "",
      newLoan: { aluno: "", livro: "", dataEmprestimo: "", dataProgramada: "", dataDevolucao: "" },
      loans: [
        { id: 1, aluno: "João Silva", livro: "O Senhor dos Anéis", dataEmprestimo: "2025-03-01", dataProgramada: "2025-03-10", dataDevolucao: "" },
        { id: 2, aluno: "Maria Souza", livro: "Harry Potter", dataEmprestimo: "2025-02-20", dataProgramada: "2025-02-28", dataDevolucao: "2025-02-28" },
        { id: 3, aluno: "Pedro Almeida", livro: "O Pequeno Príncipe", dataEmprestimo: "2025-03-05", dataProgramada: "2025-03-15", dataDevolucao: "" },
        { id: 4, aluno: "Lucas Santos", livro: "Dom Casmurro", dataEmprestimo: "2025-02-15", dataProgramada: "2025-02-25", dataDevolucao: "" }, // Atrasado
      ],
      showModal: false,
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    filteredLoans() {
      const today = new Date().toISOString().split("T")[0];

      return this.loans
        .filter(loan => {
          const isPendente = !loan.dataDevolucao;
          const isAtrasado = isPendente && loan.dataProgramada < today;

          if (this.activeTab === "pendentes") return isPendente && !isAtrasado;
          if (this.activeTab === "atrasados") return isAtrasado;

          return false;
        })
        .filter(loan =>
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
      if (!this.newLoan.aluno || !this.newLoan.livro || !this.newLoan.dataEmprestimo || !this.newLoan.dataProgramada) return;

      const newEntry = { ...this.newLoan, id: Date.now(), dataDevolucao: "" };
      this.loans.push(newEntry);
      this.newLoan = { aluno: "", livro: "", dataEmprestimo: "", dataProgramada: "", dataDevolucao: "" };
      this.showModal = false;
    },
    isLate(loan) {
      const today = new Date().toISOString().split("T")[0];
      return !loan.dataDevolucao && loan.dataProgramada < today;
    },
    formatDate(date) {
      if (!date) return "Pendente";
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
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
