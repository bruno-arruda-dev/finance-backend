/*
  Warnings:

  - Added the required column `permitions` to the `environment_share` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "environment_share" ADD COLUMN     "permitions" TEXT NOT NULL;
