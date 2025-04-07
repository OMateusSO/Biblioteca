-- CreateTable
CREATE TABLE "Aluno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "turma" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT
);

-- CreateTable
CREATE TABLE "Livro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "ano_publicacao" INTEGER NOT NULL,
    "isbn" TEXT NOT NULL,
    "emprestado" BOOLEAN NOT NULL DEFAULT false,
    "qrcode" TEXT
);

-- CreateTable
CREATE TABLE "Emprestimo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alunoId" INTEGER NOT NULL,
    "livroId" INTEGER NOT NULL,
    "dataEmprestimo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataDevolucao" DATETIME,
    CONSTRAINT "Emprestimo_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Emprestimo_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_matricula_key" ON "Aluno"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_email_key" ON "Aluno"("email");
