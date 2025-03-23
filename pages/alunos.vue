<template>
  <div class="flex items-center justify-center min-h-screen p-8 bg-gray-100">
    <!-- Card de Pesquisa -->
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Alunos</h1>
        <button @click="openModal" class="bg-blue-600 text-white p-2 flex items-center justify-center text-xl">
          Adicionar
        </button>
      </div>

      <!-- Barra de Pesquisa -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar aluno..."
        class="w-full p-2 border rounded mb-4"
      />

      <!-- Lista de Alunos com Paginação -->
      <ul v-if="paginatedStudents.length" class="space-y-2">
        <li v-for="student in paginatedStudents" :key="student.id" class="p-2 border rounded flex justify-between">
          <span>{{ student.nome }} - {{ student.matricula }} - Turma: {{ student.turma }} Email: {{ student.email }}</span>
          <span class="text-sm text-gray-500">{{ student.contato }}</span>
        </li>
      </ul>
      <p v-else class="text-gray-500 text-center">Nenhum aluno encontrado.</p>

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
        <h2 class="text-xl font-bold mb-4">Registrar Aluno</h2>
        <form @submit.prevent="addStudent">
          <div class="grid grid-cols-1 gap-4">
            <input v-model="newStudent.nome" type="text" placeholder="Nome" class="p-2 border rounded" required />
            <input v-model="newStudent.matricula" type="text" placeholder="Matrícula" class="p-2 border rounded" required />
            <input v-model="newStudent.turma" type="text" placeholder="Turma" class="p-2 border rounded" required />
            <input v-model="newStudent.contato" type="text" placeholder="Telefone" class="p-2 border rounded" required />
            <input v-model="newStudent.Email" type="text" placeholder="Email" class="p-2 border rounded" required />
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
      newStudent: {
        nome: "",
        matricula: "",
        turma: "",
        contato: "",
        email: ""
      },
      students: [], // Simulação do banco de dados local
      currentPage: 1,
      studentsPerPage: 9
    };
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
      const end = start + this.studentsPerPage;
      return this.filteredStudents.slice(start, end);
    }
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    addStudent() {
      if (!this.newStudent.nome || !this.newStudent.matricula) return;
      const newEntry = { ...this.newStudent, id: Date.now() };
      this.students.push(newEntry);
      this.newStudent = { nome: "", matricula: "", turma: "", contato: "" };
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