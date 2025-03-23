<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
      <!-- Empréstimos Mensais -->
      <div class="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        <h2 class="text-xl font-bold text-gray-700">Empréstimos Mensais</h2>
        <p class="text-3xl font-semibold text-blue-600">{{ emprestimosMensais }}</p>
      </div>

      <!-- Acervos Cadastrados -->
      <div class="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        <h2 class="text-xl font-bold text-gray-700">Acervos Cadastrados</h2>
        <p class="text-3xl font-semibold text-green-600">{{ acervosCadastrados }}</p>
      </div>

      <!-- Alunos Cadastrados -->
      <div class="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        <h2 class="text-xl font-bold text-gray-700">Alunos Cadastrados</h2>
        <p class="text-3xl font-semibold text-purple-600">{{ alunosCadastrados }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emprestimosMensais: 120, // Simulação de dado
      acervosCadastrados: 450, // Simulação de dado
      alunosCadastrados: 300 // Simulação de dado
    };
  }
};
</script>