import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  const acervos = await prisma.livro.count(); // Supondo que a tabela de livros se chama "livro"
  return { acervosCadastrados: acervos };
});
