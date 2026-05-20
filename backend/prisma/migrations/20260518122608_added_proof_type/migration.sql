/*
  Warnings:

  - Added the required column `proof_type` to the `proofs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `index` MODIFY `is_approved` BOOLEAN NULL DEFAULT false,
    MODIFY `is_community_approved` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `proofs` ADD COLUMN `proof_type` VARCHAR(191) NOT NULL;
