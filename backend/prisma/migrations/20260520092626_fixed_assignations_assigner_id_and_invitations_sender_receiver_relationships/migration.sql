-- AddForeignKey
ALTER TABLE `assignations` ADD CONSTRAINT `assignations_assigner_id_fkey` FOREIGN KEY (`assigner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
