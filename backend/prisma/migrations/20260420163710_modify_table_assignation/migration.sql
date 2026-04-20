/*
  Warnings:

  - Made the column `meta_id` on table `assignations` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `assignations` DROP FOREIGN KEY `assignations_meta_id_fkey`;

-- DropIndex
DROP INDEX `assignations_meta_id_fkey` ON `assignations`;

-- AlterTable
ALTER TABLE `assignations` MODIFY `meta_id` INTEGER NOT NULL,
    MODIFY `start_date` DATE NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE `assignations` ADD CONSTRAINT `assignations_meta_id_fkey` FOREIGN KEY (`meta_id`) REFERENCES `metas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
