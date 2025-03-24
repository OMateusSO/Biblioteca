import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    if (event.method === "GET") {
      return await prisma.aluno.findMany();
    } 
    else if (event.method === "POST") {
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