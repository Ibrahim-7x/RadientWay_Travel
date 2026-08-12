-- AlterTable: packages are now split between the /tours and /umrah listings.
ALTER TABLE "Package" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'tour';

-- Backfill: rows tagged "Umrah" before the category field existed.
UPDATE "Package" SET "category" = 'umrah' WHERE "tags" LIKE '%"Umrah"%';
