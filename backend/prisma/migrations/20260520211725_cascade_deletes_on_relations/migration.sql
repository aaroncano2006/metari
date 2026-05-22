-- DropForeignKey
ALTER TABLE `assignation_completions` DROP FOREIGN KEY `assignation_completions_assignation_id_fkey`;

-- DropForeignKey
ALTER TABLE `assignation_completions` DROP FOREIGN KEY `assignation_completions_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `assignations` DROP FOREIGN KEY `assignations_meta_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_assignation_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `group_user` DROP FOREIGN KEY `group_user_group_id_fkey`;

-- DropForeignKey
ALTER TABLE `group_user` DROP FOREIGN KEY `group_user_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `groups` DROP FOREIGN KEY `groups_owner_id_fkey`;

-- DropForeignKey
ALTER TABLE `index` DROP FOREIGN KEY `index_meta_id_fkey`;

-- DropForeignKey
ALTER TABLE `invitations` DROP FOREIGN KEY `invitations_receiver_id_fkey`;

-- DropForeignKey
ALTER TABLE `invitations` DROP FOREIGN KEY `invitations_sender_id_fkey`;

-- DropForeignKey
ALTER TABLE `metas` DROP FOREIGN KEY `metas_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `proofs` DROP FOREIGN KEY `proofs_assignation_id_fkey`;

-- DropIndex
DROP INDEX `assignation_completions_assignation_id_fkey` ON `assignation_completions`;

-- DropIndex
DROP INDEX `assignation_completions_user_id_fkey` ON `assignation_completions`;

-- DropIndex
DROP INDEX `assignations_meta_id_fkey` ON `assignations`;

-- DropIndex
DROP INDEX `comments_assignation_id_fkey` ON `comments`;

-- DropIndex
DROP INDEX `comments_user_id_fkey` ON `comments`;

-- DropIndex
DROP INDEX `group_user_user_id_fkey` ON `group_user`;

-- DropIndex
DROP INDEX `groups_owner_id_fkey` ON `groups`;

-- DropIndex
DROP INDEX `index_meta_id_fkey` ON `index`;

-- DropIndex
DROP INDEX `invitations_receiver_id_fkey` ON `invitations`;

-- DropIndex
DROP INDEX `metas_author_id_fkey` ON `metas`;

-- DropIndex
DROP INDEX `proofs_assignation_id_fkey` ON `proofs`;

-- AddForeignKey
ALTER TABLE `groups` ADD CONSTRAINT `groups_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `metas` ADD CONSTRAINT `metas_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignations` ADD CONSTRAINT `assignations_meta_id_fkey` FOREIGN KEY (`meta_id`) REFERENCES `metas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_assignation_id_fkey` FOREIGN KEY (`assignation_id`) REFERENCES `assignations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proofs` ADD CONSTRAINT `proofs_assignation_id_fkey` FOREIGN KEY (`assignation_id`) REFERENCES `assignations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_user` ADD CONSTRAINT `group_user_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_user` ADD CONSTRAINT `group_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `index` ADD CONSTRAINT `index_meta_id_fkey` FOREIGN KEY (`meta_id`) REFERENCES `metas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignation_completions` ADD CONSTRAINT `assignation_completions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignation_completions` ADD CONSTRAINT `assignation_completions_assignation_id_fkey` FOREIGN KEY (`assignation_id`) REFERENCES `assignations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
