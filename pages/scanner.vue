<template>
  <div class="flex items-center justify-center min-h-screen p-8 bg-gray-200">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
      <h1 class="text-2xl font-bold mb-4">📕 Registrar Empréstimo</h1>

      <!-- Campo de entrada para o código QR do scanner -->
      <div class="mt-4">
        <label class="block text-gray-700 font-bold">Escaneie o QR Code:</label>
        <input v-model="emprestimo.livroId" type="text" class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" @input="processQrCode" />
      </div>

      <div class="mt-4">
        <label class="block text-gray-700 font-bold">Data de Devolução:</label>
        <input v-model="emprestimo.dataDevolucao" type="date" class="p-3 border rounded-lg shadow-sm" required />
      </div>

      <div class="mt-4">
        <label class="block text-gray-700 font-bold">Aluno:</label>
        <select v-model="emprestimo.alunoId" class="w-full p-2 border rounded">
          <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">
            {{ aluno.nome }}
          </option>
        </select>
      </div>

      <button @click="registrarEmprestimo" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Confirmar Empréstimo
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emprestimo: {
        livroId: "",
        alunoId: "",
        dataEmprestimo: new Date().toISOString().split("T")[0],
        dataDevolucao: ""
      },
      alunos: [],
    };
  },
  async mounted() {
    await this.fetchAlunos();
  },
  methods: {
    processQrCode() {
      // Processa o QR Code que foi inserido pelo scanner no campo de entrada
      this.emprestimo.livroId = parseInt(this.emprestimo.livroId.replace('Livro ID: ', ''), 10) || "";
    },

    async fetchAlunos() {
      try {
        const response = await fetch("/api/alunos");
        this.alunos = await response.json();
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    },

    async registrarEmprestimo() {
      console.log("Emprestimo antes do envio:", this.emprestimo);

      if (!this.emprestimo.livroId || !this.emprestimo.alunoId || !this.emprestimo.dataDevolucao) {
        this.emprestimo.dataEmprestimo = new Date().toISOString().split("T")[0]
        alert("Por favor, preencha todos os campos.");
        return;
      }

      try {
        const response = await fetch("/api/scanner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.emprestimo),
        });

        if (response.ok) {
          console.log("Dados enviados para a requisição:", this.emprestimo);
          this.emprestimo.dataEmprestimo = new Date().toISOString().split("T")[0];
          this.emprestimo.livroId = parseInt(this.emprestimo.livroId, 10);
          this.emprestimo.alunoId = parseInt(this.emprestimo.alunoId, 10);
          alert("Empréstimo registrado com sucesso!");
          this.emprestimo = { livroId: "", alunoId: "", dataEmprestimo: "", dataDevolucao: "" };
        }
      } catch (error) {
        console.error("Erro ao registrar empréstimo:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Adicione qualquer estilo personalizado se necessário */
</style>
