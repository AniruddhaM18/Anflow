/*
  Warnings:

  - Added the required column `edges` to the `Workflow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nodes` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "edges" JSONB NOT NULL,
ADD COLUMN     "nodes" JSONB NOT NULL;
