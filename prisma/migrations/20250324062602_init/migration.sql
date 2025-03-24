/*
  Warnings:

  - You are about to drop the column `disponivel` on the `livro` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[isbn]` on the table `Livro` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `livro` DROP COLUMN `disponivel`,
    ADD COLUMN `ano_publicacao` INTEGER NULL,
    ADD COLUMN `isbn` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Livro_isbn_key` ON `Livro`(`isbn`);
