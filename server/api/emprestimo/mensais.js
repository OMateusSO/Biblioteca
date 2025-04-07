import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  const primeiroDiaDoMes = new Date();
  primeiroDiaDoMes.setDate(1);
  primeiroDiaDoMes.setHours(0, 0, 0, 0);

  const emprestimos = await prisma.emprestimo.count({
    where: {
      dataEmprestimo: {
        gte: primeiroDiaDoMes,
      },
    },
  });

  return { emprestimosMensais: emprestimos };
});
