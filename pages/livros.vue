<template>
  <div class="flex items-center justify-center min-h-screen p-8 bg-gray-200">
    <!-- Card Principal -->
    <div class="bg-white shadow-xl rounded-lg p-6 max-w-4xl w-full">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">📖 Livros</h1>
        <button @click="openModal"
          class="bg-blue-600 hover:bg-blue-700 text-white p-2  rounded-lg shadow-md transition">
          + Adicionar Livro
        </button>
      </div>

      <!-- Barra de Pesquisa -->
      <input v-model="searchQuery" type="text" placeholder="🔍 Buscar livro..."
        class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />

      <!-- Lista de Livros -->
      <ul v-if="paginatedBooks.length" class="space-y-4">
        <li v-for="book in paginatedBooks" :key="book.id"
          class="p-4 bg-white rounded-lg shadow-md flex justify-between items-center border border-gray-300 transition hover:shadow-lg">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">{{ book.titulo }}</h3>
            <p class="text-sm text-gray-600">
              ✍️ Autor: <span class="font-medium">{{ book.autor }}</span> |
              📅 Ano: <span class="font-medium">{{ book.ano_publicacao || 'Sem ano' }}</span>
            </p>
            <p class="text-sm text-gray-500">ISBN: <span class="font-medium">{{ book.isbn || 'Sem ISBN' }}</span></p>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Bolinha indicando status -->
            <span :class="{
              'bg-green-500': !book.emprestado,
              'bg-red-500': book.emprestado
            }" class="w-3 h-3 rounded-full"></span>

            <!-- Botão para ver QR Code -->
            <button v-if="book.qrcode" @click="showQRCode(book.qrcode, book.id)"
              class="px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg shadow-md transition">
              📷 QR Code
            </button>
          </div>
        </li>
      </ul>

      <p v-else class="text-gray-500 text-center mt-4">Nenhum livro encontrado.</p>

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

    <!-- Modal de Registro -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-gray-800">📖 Registrar Livro</h2>
        <form @submit.prevent="addBook">
          <div class="grid grid-cols-1 gap-4">
            <input v-model="newBook.titulo" type="text" placeholder="Título" class="p-3 border rounded-lg shadow-sm"
              required />
            <input v-model="newBook.autor" type="text" placeholder="Autor" class="p-3 border rounded-lg shadow-sm"
              required />
            <input v-model="newBook.ano_publicacao" type="number" placeholder="Ano de Publicação"
              class="p-3 border rounded-lg shadow-sm" />
            <input v-model="newBook.isbn" type="text" placeholder="ISBN" class="p-3 border rounded-lg shadow-sm" />
          </div>
          <div class="flex justify-between mt-4">
            <button type="button" @click="closeModal"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md">Cancelar</button>
            <button type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition">Registrar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de QR Code -->
    <div v-if="qrCodeModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md flex flex-col items-center">
        <h2 class="text-xl font-bold mb-4 text-gray-800">📷 QR Code do Livro</h2>

        <!-- Exibir o QR Code -->
        <img :src="selectedQRCode" alt="QR Code" class="w-48 h-48 border border-gray-300 rounded-lg shadow-md" />

        <!-- Exibir o ID abaixo do QR Code -->
        <p class="mt-2 text-gray-600 font-bold">{{ selectedBookId }}</p>

        <!-- Botões para Fechar e Imprimir -->
        <div class="flex space-x-4 mt-4">
          <button @click="closeQRCodeModal"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition">
            Fechar
          </button>
          <button @click="printQRCode"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition">
            Imprimir
          </button>
        </div>
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
      qrCodeModal: false, // Estado do modal de QR Code
      selectedQRCode: "", // URL do QR Code selecionado
      selectedBookId: null, // ID do livro selecionado
      newBook: {
        titulo: "",
        autor: "",
        ano_publicacao: "",
        isbn: "",
        emprestado: false
      },
      books: [],
      currentPage: 1,
      booksPerPage: 8
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

    printQRCode() {
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Imprimir QR Code</title></head><body>');
  printWindow.document.write('<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 0;">');
  // Imprime o QR Code
  printWindow.document.write('<img src="' + this.selectedQRCode + '" alt="QR Code" style="width: 200px; height: 200px; margin-bottom: 0;" />');
  // Imprime o ID abaixo do QR Code
  printWindow.document.write('<p style="font-size: 20px; font-weight: bold; color: black; margin-top: 0;">' + this.selectedBookId + '</p>');
  printWindow.document.write('</div>');
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
},

    async fetchBooks() {
      try {
        const response = await fetch("/api/livros"); // Busca os livros do backend
        if (!response.ok) throw new Error("Erro ao carregar livros");

        this.books = await response.json(); // Atualiza a lista de livros
        console.log("Livros carregados:", this.books); // Verifique se os livros estão vindo corretamente
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      }
    },

    async addBook() {
      if (!this.newBook.titulo || !this.newBook.autor) return;

      try {
        const response = await fetch("/api/livros", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.newBook),
        });

        if (!response.ok) throw new Error("Erro ao adicionar livro");

        await this.fetchBooks(); // Atualiza a lista de livros depois de adicionar um novo
        this.newBook = { titulo: "", autor: "", ano_publicacao: "", isbn: "", emprestado: false };
        this.closeModal();
      } catch (error) {
        console.error(error);
      }
    },

    showQRCode(qrCodeUrl, bookId) {
      this.selectedQRCode = qrCodeUrl;
      this.selectedBookId = bookId; // Armazena o ID do livro
      this.qrCodeModal = true;
    },
    closeQRCodeModal() {
      this.qrCodeModal = false;
      this.selectedQRCode = "";
      this.selectedBookId = null; // Limpa o ID ao fechar o modal
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
  },
  mounted() {
    this.fetchBooks(); // Carrega os livros assim que a página for carregada
  }
};
</script>

<style scoped>
.bolinha-verde {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #32CD32;
  display: inline-block;
}

.bolinha-vermelha {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  display: inline-block;
}
</style>
