/*
  Warnings:

  - Added the required column `age` to the `DbStudent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DbStudent" ADD COLUMN     "age" INTEGER NOT NULL;
