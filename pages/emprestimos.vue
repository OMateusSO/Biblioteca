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
            <h3 class="text-lg font-semibold text-gray-900">{{ loan.aluno.nome }}</h3>
            <p class="text-sm text-gray-600">
              Pegou: <span class="font-medium">"{{ loan.livro.titulo }}"</span> em
              <span class="font-medium">{{ formatDate(loan.dataEmprestimo) }}</span>
            </p>
          </div>
          <div class="text-right text-sm">
            <p>Devolução:
              <span :class="isLate(loan) ? 'text-red-500 font-medium' : 'text-gray-700'">
                {{ formatDate(loan.dataDevolucao) }}
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
          <div class="grid grid-cols-1 gap-4 relative">
            <!-- Campo da Matrícula -->
            <div class="relative">
              <input v-model="newLoan.matricula" type="text" placeholder="Matrícula do aluno"
                class="p-2 border rounded w-full" @input="matriculaError = ''" required />
              <div v-if="matriculaError"
                class="absolute left-0 mt-1 text-sm text-red-600 bg-red-100 border border-red-400 p-2 rounded shadow">
                {{ matriculaError }}
              </div>
            </div>

            <!-- Combobox Pesquisável -->
            <div class="relative">
              <div class="relative">
                <input v-model="livroSearchQuery" @focus="dropdownOpen = true" @blur="closeDropdown"
                  @keydown.down.prevent="navigate(1)" @keydown.up.prevent="navigate(-1)"
                  @keydown.enter.prevent="selectLivro(filteredLivros[selectedIndex])" type="text"
                  placeholder="Selecione um livro" class="p-2 border rounded w-full" />

                <!-- Dropdown -->
                <div v-if="dropdownOpen" class="absolute z-10 w-full bg-white border rounded shadow-md mt-1">
                  <div v-for="(livro, index) in filteredLivros" :key="livro.id" @mousedown.prevent="selectLivro(livro)"
                    :class="selectedIndex === index ? 'bg-blue-100' : 'bg-white'"
                    class="p-2 cursor-pointer hover:bg-blue-100">
                    {{ livro.titulo }}
                  </div>
                  <div v-if="filteredLivros.length === 0" class="p-2 text-gray-500">Nenhum livro encontrado.</div>
                </div>
              </div>
            </div>

            <p>Devolução Programada</p>
            <input v-model="newLoan.dataDevolucao" type="date" class="p-2 border rounded w-full" required />
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
      livroSearchQuery: "", 
      newLoan: { alunoId: "", livroId: "", dataEmprestimo: new Date().toISOString().split("T")[0], dataDevolucao: "" },
      loans: [],
      livros: [],
      dropdownOpen: false,
      selectedIndex: -1,
      showModal: false,
      currentPage: 1,
      itemsPerPage: 4,
      matriculaError: "",
    };
  },
  computed: {
    filteredLivros() {
      if (!this.livroSearchQuery) return this.livros;
      return this.livros.filter(livro =>
        livro.titulo.toLowerCase().includes(this.livroSearchQuery.toLowerCase())
      );
    },
    filteredLoans() {
      return this.loans.filter((loan) => {
        const hoje = new Date();
        const dataDevolucao = new Date(loan.dataDevolucao);

        if (this.activeTab === "pendentes") {
          return dataDevolucao >= hoje;
        } else if (this.activeTab === "atrasados") {
          return dataDevolucao < hoje;
        }

        return true;
      });
    },
    paginatedLoans() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredLoans.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredLoans.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchLoans() {
      try {
        const response = await fetch("/api/emprestimos");
        const data = await response.json();
        this.loans = data;
      } catch (error) {
        console.error("Erro ao buscar empréstimos:", error);
      }
    },
    async fetchLivros() {
      try {
        const response = await fetch("/api/livros");
        this.livros = await response.json();
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      }
    },
    selectLivro(livro) {
      if (livro) {
        this.livroSearchQuery = livro.titulo;
        this.newLoan.livroId = livro.id;
      }
      this.dropdownOpen = false;
    },
    navigate(direction) {
      if (!this.dropdownOpen) return;
      this.selectedIndex = Math.min(
        Math.max(this.selectedIndex + direction, 0),
        this.filteredLivros.length - 1
      );
    },
    closeDropdown() {
      setTimeout(() => {
        this.dropdownOpen = false;
      }, 200);
    },
    async addLoan() {
      if (!this.newLoan.matricula || !this.newLoan.livroId || !this.newLoan.dataDevolucao) {
        this.matriculaError = "Preencha todos os campos.";
        return;
      }
      try {
        const alunoResponse = await fetch(`/api/alunos/${this.newLoan.matricula}`);
        if (!alunoResponse.ok) {
          this.matriculaError = "Matrícula não encontrada!";
          return;
        }
        const response = await fetch("/api/emprestimos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.newLoan),
        });
        if (response.ok) {
          this.showModal = false;
          this.newLoan = { matricula: "", livroId: "", dataEmprestimo: "", dataDevolucao: "" };
          this.fetchLoans();
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("pt-BR");
    },
    isLate(loan) {
      return new Date(loan.dataDevolucao) < new Date();
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
  },
  mounted() {
    this.fetchLoans();
    this.fetchLivros();
  },
};
</script>
