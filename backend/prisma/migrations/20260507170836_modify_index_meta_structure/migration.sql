/*
  Warnings:

  - You are about to drop the column `group_id` on the `index` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `index` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `index` DROP FOREIGN KEY `index_group_id_fkey`;

-- DropIndex
DROP INDEX `index_group_id_fkey` ON `index`;

-- AlterTable
ALTER TABLE `index` DROP COLUMN `group_id`,
    DROP COLUMN `is_public`;

-- AlterTable
ALTER TABLE `metas` ADD COLUMN `is_public` BOOLEAN NOT NULL DEFAULT false;
