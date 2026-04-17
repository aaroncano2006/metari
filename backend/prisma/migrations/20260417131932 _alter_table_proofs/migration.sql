-- DropForeignKey
ALTER TABLE `proofs` DROP FOREIGN KEY `proofs_user_id_fkey`;

-- DropIndex
DROP INDEX `proofs_user_id_fkey` ON `proofs`;

-- AlterTable
ALTER TABLE `proofs` MODIFY `user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `proofs` ADD CONSTRAINT `proofs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
