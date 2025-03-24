/*
  Warnings:

  - A unique constraint covering the columns `[matricula]` on the table `Aluno` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricula` to the `Aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turma` to the `Aluno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aluno` ADD COLUMN `matricula` VARCHAR(191) NOT NULL,
    ADD COLUMN `turma` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Aluno_matricula_key` ON `Aluno`(`matricula`);
