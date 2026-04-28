-- AlterTable
ALTER TABLE `metas` ADD COLUMN `category_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `metas` ADD CONSTRAINT `metas_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
