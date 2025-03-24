import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  if (event.node.req.method === "POST") {
    try {
      const body = await readBody(event);
      console.log("Recebendo novo livro:", body); // <-- Adicione este log

      const livro = await prisma.livro.create({
        data: {
          titulo: body.titulo,
          autor: body.autor,
          ano_publicacao: body.ano_publicacao ? Number(body.ano_publicacao) : null,
          isbn: body.isbn || null
        },
      });

      return livro;
    } catch (error) {
      console.error("Erro ao criar livro:", error);
      return { error: "Erro ao criar livro" };
    }
  }

  if (event.node.req.method === "GET") {
    return await prisma.livro.findMany();
  }
});
