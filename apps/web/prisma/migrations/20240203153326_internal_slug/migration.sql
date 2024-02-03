-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "internalSlug" TEXT;

-- Custom SQL
-- Update label of Email Address to Email
UPDATE "Attribute" SET "label" = 'Email' WHERE "label" = 'Email Address';
-- Use lowercase label with replaced whitespace as internalSlug where system is true
UPDATE "Attribute" SET "internalSlug" = LOWER(REPLACE("label", ' ', '-')) WHERE "system" = true;
