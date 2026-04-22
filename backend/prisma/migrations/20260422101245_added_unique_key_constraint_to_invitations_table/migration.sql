/*
  Warnings:

  - A unique constraint covering the columns `[sender_id,receiver_id,group_id]` on the table `invitations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `invitations_sender_id_receiver_id_group_id_key` ON `invitations`(`sender_id`, `receiver_id`, `group_id`);
