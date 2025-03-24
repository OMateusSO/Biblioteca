import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  if (event.node.req.method === "POST") {
    try {
      const body = await readBody(event);

      // Buscar aluno pela matrícula
      const alunoExistente = await prisma.aluno.findUnique({
        where: { matricula: body.matricula },
      });

      if (!alunoExistente) {
        return { error: "Aluno não encontrado" };
      }

      // Verificar se o livro existe
      const livroExistente = await prisma.livro.findUnique({
        where: { id: body.livroId },
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

      return emprestimo;
    } catch (error) {
      console.error("Erro ao registrar empréstimo:", error);
      return { error: "Erro ao registrar empréstimo" };
    }
  }

  if (event.node.req.method === "GET") {
    try {
      const emprestimos = await prisma.emprestimo.findMany({
        include: {
          aluno: {
            select: {
              id: true,
              nome: true,  // <- Inclui o nome do aluno
            }
          },
          livro: {
            select: {
              id: true,
              titulo: true,  // <- Inclui o título do livro
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
});
