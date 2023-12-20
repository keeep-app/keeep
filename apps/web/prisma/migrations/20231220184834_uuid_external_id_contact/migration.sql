-- AlterTable
ALTER TABLE "public"."Contact" ALTER COLUMN "externalId" DROP DEFAULT,
ALTER COLUMN "externalId" SET DATA TYPE TEXT;
DROP SEQUENCE "Contact_externalId_seq";
