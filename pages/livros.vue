<template>
  <div class="flex items-center justify-center min-h-screen p-8 bg-gray-100">
    <!-- Card de Pesquisa -->
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Livros</h1>
        <button @click="openModal" class="bg-blue-600 text-white p-2 flex items-center justify-center text-xl">
          Adicionar
        </button>
      </div>

      <!-- Barra de Pesquisa -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar livro..."
        class="w-full p-2 border rounded mb-4"
      />

      <!-- Lista de Livros com Paginação -->
      <ul v-if="paginatedBooks.length" class="space-y-2">
        <li v-for="book in paginatedBooks" :key="book.id" class="p-2 border rounded flex justify-between">
          <span>{{ book.titulo }} - {{ book.autor }} ({{ book.ano_publicacao || 'Sem ano' }})</span>
          <span class="text-sm text-gray-500">{{ book.isbn || 'Sem ISBN' }}</span>
        </li>
      </ul>
      <p v-else class="text-gray-500 text-center">Nenhum livro encontrado.</p>

      <!-- Controles de Paginação -->
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

    <!-- Modal de Registro -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Registrar Livro</h2>
        <form @submit.prevent="addBook">
          <div class="grid grid-cols-1 gap-4">
            <input v-model="newBook.titulo" type="text" placeholder="Título" class="p-2 border rounded" required />
            <input v-model="newBook.autor" type="text" placeholder="Autor" class="p-2 border rounded" required />
            <input v-model="newBook.ano_publicacao" type="number" placeholder="Ano de Publicação" class="p-2 border rounded" />
            <input v-model="newBook.isbn" type="text" placeholder="ISBN" class="p-2 border rounded" />
          </div>
          <div class="flex justify-between mt-4">
            <button type="button" @click="closeModal" class="p-2 bg-gray-400 text-white rounded">Cancelar</button>
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
      showModal: false,
      newBook: {
        titulo: "",
        autor: "",
        ano_publicacao: "",
        isbn: ""
      },
      books: [], // Simulação do banco de dados local
      currentPage: 1,
      booksPerPage: 9
    };
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book =>
        book.titulo.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.booksPerPage);
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.booksPerPage;
      const end = start + this.booksPerPage;
      return this.filteredBooks.slice(start, end);
    }
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    addBook() {
      if (!this.newBook.titulo || !this.newBook.autor) return;
      const newEntry = { ...this.newBook, id: Date.now() };
      this.books.push(newEntry);
      this.newBook = { titulo: "", autor: "", ano_publicacao: "", isbn: "" };
      this.closeModal();
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
};
</script>
