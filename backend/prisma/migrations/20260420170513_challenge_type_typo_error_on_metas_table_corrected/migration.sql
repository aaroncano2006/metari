/*
  Warnings:

  - The values [challange] on the enum `metas_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `metas` MODIFY `type` ENUM('task', 'challenge') NOT NULL DEFAULT 'task';
