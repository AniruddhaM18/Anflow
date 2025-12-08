/*
  Warnings:

  - The values [TELEGRAM,GMAIL] on the enum `Actions` will be removed. If these variants are still used in the database, this will fail.
  - The values [TELEGRAM,GMAIL] on the enum `Platform` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Actions_new" AS ENUM ('telegram', 'gmail');
ALTER TYPE "Actions" RENAME TO "Actions_old";
ALTER TYPE "Actions_new" RENAME TO "Actions";
DROP TYPE "public"."Actions_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Platform_new" AS ENUM ('telegram', 'gmail');
ALTER TABLE "Credential" ALTER COLUMN "platform" TYPE "Platform_new" USING ("platform"::text::"Platform_new");
ALTER TYPE "Platform" RENAME TO "Platform_old";
ALTER TYPE "Platform_new" RENAME TO "Platform";
DROP TYPE "public"."Platform_old";
COMMIT;
