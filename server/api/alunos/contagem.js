import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  const alunos = await prisma.aluno.count();
  return { alunosCadastrados: alunos };
});
