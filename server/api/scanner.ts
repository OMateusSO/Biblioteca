import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Método POST - Registrar empréstimo
  if (event.node.req.method === "POST") {
    try {
      const body = await readBody(event);

      const alunoExistente = await prisma.aluno.findUnique({
        where: { id: body.alunoId },
      });
      
      if (!alunoExistente) {
        return { error: "Aluno não encontrado" };
      }

      // Verifique se o alunoId foi passado corretamente
      if (!body.alunoId || isNaN(body.alunoId)) {
        return { error: "Aluno ID inválido" };
      }



      // Verificar se o livro existe
      const livroExistente = await prisma.livro.findUnique({
        where: { id: parseInt(body.livroId, 10) }, // Certifique-se de converter para número
      });


      if (!livroExistente) {
        return { error: "Livro não encontrado" };
      }

      // Criar o empréstimo
      const emprestimo = await prisma.emprestimo.create({
        data: {
          alunoId: alunoExistente.id, // Usa o ID do aluno encontrado
          livroId: body.livroId,
          dataEmprestimo: new Date(body.dataEmprestimo),
          dataDevolucao: body.dataDevolucao ? new Date(body.dataDevolucao) : null,
        },
        include: {
          aluno: true,
          livro: true,
        },
      });

      // Atualizar o livro para marcar como emprestado
      await prisma.livro.update({
        where: { id: body.livroId },
        data: { emprestado: true },
      });

      return emprestimo;
    } catch (error) {
      console.error("Erro ao registrar empréstimo:", error);
      return { error: "Erro ao registrar empréstimo" };
    }
  }

  // Método GET - Buscar empréstimos
  if (event.node.req.method === "GET") {
    try {
      const emprestimos = await prisma.emprestimo.findMany({
        include: {
          aluno: {
            select: {
              id: true,
              nome: true,  // Inclui o nome do aluno
            }
          },
          livro: {
            select: {
              id: true,
              titulo: true,  // Inclui o título do livro
            }
          }
        },
      });

      return emprestimos;
    } catch (error) {
      console.error("Erro ao buscar empréstimos:", error);
      return { error: "Erro ao buscar empréstimos" };
    }
  }

  // Método DELETE - Remover empréstimo
  if (event.node.req.method === "DELETE") {
    try {
      // Captura o ID da query string (por exemplo, ?id=32)
      const query = getQuery(event);
      const id = parseInt(query.id as string, 10);

      if (isNaN(id)) {
        console.error("ID inválido:", id);
        return { error: "ID inválido" };
      }

      // Verificar se o empréstimo existe
      const emprestimoExistente = await prisma.emprestimo.findUnique({
        where: { id },
      });

      if (!emprestimoExistente) {
        return { error: "Empréstimo não encontrado" };
      }

      // Remover o empréstimo
      await prisma.emprestimo.delete({
        where: { id },
      });

      // Atualizar o livro para marcar como não emprestado
      await prisma.livro.update({
        where: { id: emprestimoExistente.livroId },
        data: { emprestado: false },
      });

      return { success: true };
    } catch (error) {
      console.error("Erro ao remover empréstimo:", error);
      return { error: "Erro ao remover empréstimo" };
    }
  }
});
