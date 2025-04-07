<template>
  <div class="flex items-center justify-center min-h-screen p-8 bg-gray-200">
    <!-- Card Principal -->
    <div class="bg-white shadow-xl rounded-lg p-6 max-w-4xl w-full">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">🎓 Alunos</h1>
        <button @click="openModal" class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition">
          + Adicionar Aluno
        </button>
      </div>

      <!-- Barra de Pesquisa -->
      <input v-model="searchQuery" type="text" placeholder="🔍 Buscar aluno..."
        class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />

      <!-- Lista de Alunos -->
      <ul v-if="paginatedStudents.length" class="space-y-4">
        <li v-for="student in paginatedStudents" :key="student.id"
          class="p-4 bg-white rounded-lg shadow-md flex justify-between items-center border border-gray-300 transition hover:shadow-lg">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">{{ student.nome }}</h3>
            <p class="text-sm text-gray-600">
              🎓 Matrícula: <span class="font-medium">{{ student.matricula }}</span> |
              🏫 Turma: <span class="font-medium">{{ student.turma }}</span>
            </p>
            <p class="text-sm text-gray-500">📧 Email: <span class="font-medium">{{ student.email }}</span></p>
            <p class="text-sm text-gray-500">📞 Telefone: <span class="font-medium">{{ student.telefone }}</span></p>
          </div>
        </li>
      </ul>

      <p v-else class="text-gray-500 text-center mt-4">Nenhum aluno encontrado.</p>

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
        <h2 class="text-xl font-bold mb-4 text-gray-800">🎓 Registrar Aluno</h2>
        <form @submit.prevent="addStudent">
          <div class="grid grid-cols-1 gap-4">
            <input v-model="newStudent.nome" type="text" placeholder="Nome" class="p-3 border rounded-lg shadow-sm" required />
            <input v-model="newStudent.matricula" type="text" placeholder="Matrícula" class="p-3 border rounded-lg shadow-sm" required />
            <input v-model="newStudent.turma" type="text" placeholder="Turma" class="p-3 border rounded-lg shadow-sm" required />
            <input v-model="newStudent.telefone" type="text" placeholder="Telefone" class="p-3 border rounded-lg shadow-sm" required />
            <input v-model="newStudent.email" type="email" placeholder="Email" class="p-3 border rounded-lg shadow-sm" required />
          </div>
          <div class="flex justify-between mt-4">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition">Registrar</button>
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
      newStudent: {
        nome: "",
        matricula: "",
        turma: "",
        telefone: "",
        email: ""
      },
      students: [],
      currentPage: 1,
      studentsPerPage: 8
    };
  },
  async mounted() {
    await this.fetchStudents();
  },
  computed: {
    filteredStudents() {
      return this.students.filter(student =>
        student.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredStudents.length / this.studentsPerPage);
    },
    paginatedStudents() {
      const start = (this.currentPage - 1) * this.studentsPerPage;
      return this.filteredStudents.slice(start, start + this.studentsPerPage);
    }
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await fetch("/api/alunos");
        this.students = await response.json();
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async addStudent() {
      if (!this.newStudent.nome || !this.newStudent.matricula) return;

      try {
        const response = await fetch("/api/alunos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.newStudent)
        });

        if (response.ok) {
          await this.fetchStudents();
          this.closeModal();
          this.newStudent = { nome: "", matricula: "", turma: "", telefone: "", email: "" };
        }
      } catch (error) {
        console.error("Erro ao adicionar aluno:", error);
      }
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