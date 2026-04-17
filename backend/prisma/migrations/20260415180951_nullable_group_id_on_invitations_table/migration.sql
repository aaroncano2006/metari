-- DropForeignKey
ALTER TABLE `invitations` DROP FOREIGN KEY `invitations_group_id_fkey`;

-- DropForeignKey
ALTER TABLE `proofs` DROP FOREIGN KEY `proofs_user_id_fkey`;

-- DropIndex
DROP INDEX `invitations_group_id_fkey` ON `invitations`;

-- DropIndex
DROP INDEX `proofs_user_id_fkey` ON `proofs`;

-- AlterTable
ALTER TABLE `invitations` MODIFY `group_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `proofs` MODIFY `user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `proofs` ADD CONSTRAINT `proofs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
