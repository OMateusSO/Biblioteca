<template>
  <div class="flex items-center justify-center min-h-screen p-8 bg-gray-200">
    <div class="bg-white shadow-xl rounded-lg p-6 max-w-4xl w-full">
      <!-- Cabeçalho -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">📚 Empréstimos</h1>
        <div class="button-container">
          <button @click="showModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white p-2 m-2  rounded-lg shadow-md transition">Adicionar</button>
          <button @click="irParaScanner"
            class="bg-blue-600 hover:bg-blue-700 text-white p-2 m-2 rounded-lg shadow-md transition">Scannear</button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b my-4">
        <ul class="flex">
          <li @click="activeTab = 'pendentes'"
            :class="activeTab === 'pendentes' ? 'border-b-4 border-blue-500 text-blue-600 font-semibold' : 'text-gray-500'"
            class="cursor-pointer px-4 py-2 transition-all hover:text-blue-600">
            📌 Pendentes
          </li>
          <li @click="activeTab = 'atrasados'"
            :class="activeTab === 'atrasados' ? 'border-b-4 border-red-500 text-red-600 font-semibold' : 'text-gray-500'"
            class="cursor-pointer px-4 py-2 transition-all hover:text-red-600">
            ⚠️ Atrasados
          </li>
        </ul>
      </div>

      <!-- Barra de Pesquisa -->
      <input v-model="searchQuery" type="text" placeholder="🔍 Buscar empréstimo por livro ou aluno..."
        class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />

      <!-- Lista de Empréstimos -->
      <ul v-if="paginatedLoans.length" class="space-y-4">
        <li v-for="loan in paginatedLoans" :key="loan.id"
          class="p-4 bg-white rounded-lg shadow-md flex justify-between items-center border border-gray-300 transition hover:shadow-lg">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">{{ loan.aluno.nome }}</h3>
            <p class="text-sm text-gray-600">
              📚 Livro: <span class="font-medium">"{{ loan.livro.titulo }}"</span>
            </p>
            <p class="text-sm text-gray-600">
              📅 Emprestado: <span class="font-medium">{{ formatDate(loan.dataEmprestimo) }}</span>
            </p>
            <p class="text-sm text-gray-600">
              📆 Devolução: <span :class="isLate(loan) ? 'text-red-500 font-medium' : 'text-gray-700 font-medium'">{{
                formatDate(loan.dataDevolucao)
              }}</span></p>
          </div>
          <div class="flex items-center space-x-3">
            <button @click="openRemoveModal(loan)"
              class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition">Remover</button>
          </div>
        </li>
      </ul>

      <p v-else class="text-gray-500 text-center mt-4">Nenhum empréstimo encontrado.</p>

      <!-- Paginação -->
      <div v-if="totalPages > 1" class="flex justify-between items-center mt-6">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md disabled:opacity-50 transition">
          ⬅️ Anterior
        </button>
        <span class="text-gray-700">Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md disabled:opacity-50 transition">
          Próximo ➡️
        </button>
      </div>
    </div>

    <!-- Modal de Empréstimo -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-gray-800">📖 Novo Empréstimo</h2>
        <form @submit.prevent="addLoan">
          <div class="grid grid-cols-1 gap-4">
            <input v-model="newLoan.matricula" type="text" placeholder="Matrícula do aluno"
              class="p-3 border rounded-lg shadow-sm" required />


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


            <!-- <input v-model="livroSearchQuery" type="text" placeholder="Selecione um livro"
              class="p-3 border rounded-lg shadow-sm" required /> -->


            <input v-model="newLoan.dataDevolucao" type="date" placeholder="Data de Devolução"
              class="p-3 border rounded-lg shadow-sm" required />
          </div>
          <div class="flex justify-between mt-4">
            <button type="button" @click="showModal = false"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md">Cancelar</button>
            <button type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition">Registrar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Remoção de Empréstimo -->
    <div v-if="showRemoveModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Confirmar Remoção</h2>
        <p>Tem certeza que deseja remover este empréstimo?</p>
        <div class="flex justify-between mt-4">
          <button type="button" @click="showRemoveModal = false"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md">Cancelar</button>
          <button @click="removeLoan"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition">Devolvido</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      activeTab: "pendentes",
      searchQuery: "", // Mantido para buscar empréstimos na lista principal
      livroSearchQuery: "", // Novo campo para pesquisa de livros no combobox
      newLoan: { alunoId: "", livroId: "", dataEmprestimo: new Date().toISOString().split("T")[0], dataDevolucao: "" },
      loans: [],
      livros: [],
      dropdownOpen: false,
      selectedIndex: -1,
      showModal: false,
      showRemoveModal: false,
      loanToRemove: null,
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
      return this.loans
        .filter((loan) => {
          const hoje = new Date();
          const dataDevolucao = new Date(loan.dataDevolucao);

          if (this.activeTab === "pendentes" && dataDevolucao < hoje) {
            return false;
          } else if (this.activeTab === "atrasados" && dataDevolucao >= hoje) {
            return false;
          }

          // Lógica de pesquisa por aluno ou livro
          const searchLower = this.searchQuery.toLowerCase();
          return (
            loan.aluno.nome.toLowerCase().includes(searchLower) ||
            loan.livro.titulo.toLowerCase().includes(searchLower)
          );
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
    irParaScanner() {
      this.$router.push("/scanner"); // Redireciona para a página do scanner
    },
    openRemoveModal(loan) {
      this.loanToRemove = loan; // Salva o empréstimo a ser removido
      this.showRemoveModal = true; // Exibe o modal de remoção
    },

    async removeLoan() {
      if (!this.loanToRemove) return;

      try {
        console.log("ID do empréstimo a remover:", this.loanToRemove.id); // Verifique se o ID está correto
        const response = await fetch(`/api/emprestimos?id=${this.loanToRemove.id}`, {
          method: "DELETE",
        });

        const result = await response.json();
        console.log("Resultado da remoção:", result); // Verifique o conteúdo da resposta

        if (result && result.success) {
          this.fetchLoans(); // Recarrega a lista de empréstimos
          this.showRemoveModal = false; // Fecha o modal de remoção
          this.loanToRemove = null; // Limpa a variável de empréstimo
        } else {
          console.error("Erro ao remover empréstimo:", result.message || "Erro desconhecido");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    },

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
      if (!livro) return;

      this.livroSearchQuery = livro.titulo;
      this.newLoan.livroId = livro.id;
      this.dropdownOpen = false;
    },
    navigate(direction) {
      if (!this.dropdownOpen || this.filteredLivros.length === 0) return;
      this.selectedIndex = (this.selectedIndex + direction + this.filteredLivros.length) % this.filteredLivros.length;
    },
    closeDropdown() {
      setTimeout(() => {
        this.dropdownOpen = false;
      }, 200);
    },

    async addLoan() {
  if (!this.newLoan.matricula || !this.newLoan.livroId || !this.newLoan.dataDevolucao) return;

  try {
    
    const dataDevolucao = new Date(this.newLoan.dataDevolucao);
    dataDevolucao.setDate(dataDevolucao.getDate() + 1);

    const response = await fetch("/api/emprestimos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matricula: this.newLoan.matricula,
        livroId: Number(this.newLoan.livroId),
        dataEmprestimo: this.newLoan.dataEmprestimo,
        dataDevolucao: dataDevolucao.toISOString().split("T")[0], 
      }),
    });

    const newEntry = await response.json();
    if (!newEntry.error) {
      this.showModal = false;
      this.newLoan = { matricula: "", livroId: "", dataEmprestimo: "", dataDevolucao: "" };
      this.fetchLoans();
    } else {
      console.error("Erro ao adicionar empréstimo:", newEntry.error);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
},

formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
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