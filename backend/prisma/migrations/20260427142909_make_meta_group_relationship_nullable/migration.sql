-- DropForeignKey
ALTER TABLE `metas` DROP FOREIGN KEY `metas_group_id_fkey`;

-- DropIndex
DROP INDEX `metas_group_id_fkey` ON `metas`;

-- AlterTable
ALTER TABLE `metas` MODIFY `group_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `metas` ADD CONSTRAINT `metas_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
