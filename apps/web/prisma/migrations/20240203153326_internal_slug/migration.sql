-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "internalSlug" TEXT;
-- Custom SQL
-- use lowercase label with replaced whitespace as internalSlug where system is true
UPDATE "Attribute" SET "internalSlug" = LOWER(REPLACE("label", ' ', '-')) WHERE "system" = true;

