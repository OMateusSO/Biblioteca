import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { titulo, autor, ano_publicacao, isbn } = body;

    if (!titulo || !autor || !ano_publicacao || !isbn) {
      throw createError({ statusCode: 400, statusMessage: "Dados incompletos" });
    }

    // Criar o registro do livro no banco
    const novoLivro = await prisma.livro.create({
      data: { titulo, autor, ano_publicacao, isbn, emprestado: false },
    });

    // Caminho do diretório para salvar os QR Codes
    const qrDir = path.join(process.cwd(), "public/qrcodes");
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    // Caminho do arquivo QR Code
    const qrPath = `${qrDir}/livro_${novoLivro.id}.png`;
    const qrUrl = `/qrcodes/livro_${novoLivro.id}.png`;

    // Log para verificar o caminho
    console.log('Caminho do QR Code:', qrPath);

    // Gerar QR Code e salvar como imagem
    await QRCode.toFile(qrPath, `livro-${novoLivro.id}`);

    // Verificar se o arquivo foi gerado
    if (fs.existsSync(qrPath)) {
      console.log('QR Code gerado com sucesso!');
    } else {
      console.error('Erro ao gerar QR Code!');
    }

    // Atualizar o livro com a URL do QR Code
    const updatedLivro = await prisma.livro.update({
      where: { id: novoLivro.id },
      data: { qrcode: qrUrl },  // Atualizando com a URL correta
    });

    return { message: "Livro cadastrado com QR Code!", livro: updatedLivro, qrcode: qrUrl };
  } catch (error) {
    console.error("Erro ao cadastrar livro:", error);
    throw createError({ statusCode: 500, statusMessage: "Erro interno no servidor" });
  }
});
