import { PrismaClient } from "@prisma/client";
import QRCode from 'qrcode';
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  if (event.node.req.method === "POST") {
    try {
      const body = await readBody(event);
      console.log("Recebendo novo livro:", body);

      // Criar livro no banco de dados sem QR Code primeiro
      const livro = await prisma.livro.create({
        data: {
          titulo: body.titulo,
          autor: body.autor,
          ano_publicacao: body.ano_publicacao ? Number(body.ano_publicacao) : null,
          isbn: body.isbn || null
        },
      });

      // Gerar QR Code e salvar a imagem
      const qrCodePath = `/qrcodes/livro_${livro.id}.png`;
      const fullPath = path.join("public", qrCodePath);

      await QRCode.toFile(fullPath, `Livro ID: ${livro.id}`);

      // Atualizar o livro com o caminho do QR Code
      const livroAtualizado = await prisma.livro.update({
        where: { id: livro.id },
        data: { qrcode: qrCodePath },
      });

      return livroAtualizado;
    } catch (error) {
      console.error("Erro ao criar livro:", error);
      return { error: "Erro ao criar livro" };
    }
  }

  if (event.node.req.method === "GET") {
    return await prisma.livro.findMany();
  }
});