import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const { method } = event.node.req;
    const { matricula } = event.context.params || {};

    if (method === "GET") {
      if (matricula) {
        // Buscar aluno pela matrícula
        const aluno = await prisma.aluno.findUnique({
          where: { matricula },
        });

        if (!aluno) {
          throw createError({ statusCode: 404, statusMessage: "Aluno não encontrado" });
        }

        return aluno;
      }
      return await prisma.aluno.findMany();
    } else if (method === "POST") {
      const body = await readBody(event);
      if (!body.nome || !body.matricula || !body.turma) {
        throw createError({ statusCode: 400, statusMessage: "Dados incompletos" });
      }
      return await prisma.aluno.create({ data: body });
    }
  } catch (error) {
    console.error("Erro no endpoint alunos:", error);
    throw createError({ statusCode: 500, statusMessage: "Erro interno no servidor" });
  }
});
