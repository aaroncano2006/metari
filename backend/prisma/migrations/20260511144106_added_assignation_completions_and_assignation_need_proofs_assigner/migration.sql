-- AlterTable
ALTER TABLE `assignations` ADD COLUMN `assigner_id` INTEGER NULL,
    ADD COLUMN `needs_proofs` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `metas` MODIFY `is_public` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `assignation_completions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assignation_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `is_Completed` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assignation_completions` ADD CONSTRAINT `assignation_completions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignation_completions` ADD CONSTRAINT `assignation_completions_assignation_id_fkey` FOREIGN KEY (`assignation_id`) REFERENCES `assignations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
