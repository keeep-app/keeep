-- CreateEnum
CREATE TYPE "public"."AttributeType" AS ENUM ('TEXT', 'NUMBER', 'DATE', 'CHECKBOX', 'SELECT', 'MULTISELECT', 'URL', 'EMAIL', 'PHONE', 'TAGS', 'FILE', 'SOCIAL');

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" SERIAL NOT NULL,
    "supabaseId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatar" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attribute" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "system" BOOLEAN NOT NULL DEFAULT false,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "type" "public"."AttributeType" NOT NULL DEFAULT 'TEXT',
    "label" TEXT NOT NULL,
    "config" JSONB,
    "icon" TEXT,
    "description" TEXT,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "attributes" JSONB NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "externalId" SERIAL NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."List" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_OrganizationToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_ContactToList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_CompanyToContact" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_supabaseId_key" ON "public"."Profile"("supabaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "public"."Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_externalId_key" ON "public"."Contact"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "List_slug_key" ON "public"."List"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "public"."Company"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationToProfile_AB_unique" ON "public"."_OrganizationToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationToProfile_B_index" ON "public"."_OrganizationToProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContactToList_AB_unique" ON "public"."_ContactToList"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactToList_B_index" ON "public"."_ContactToList"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToContact_AB_unique" ON "public"."_CompanyToContact"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToContact_B_index" ON "public"."_CompanyToContact"("B");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_supabaseId_fkey" FOREIGN KEY ("supabaseId") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attribute" ADD CONSTRAINT "Attribute_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."List" ADD CONSTRAINT "List_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Company" ADD CONSTRAINT "Company_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OrganizationToProfile" ADD CONSTRAINT "_OrganizationToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OrganizationToProfile" ADD CONSTRAINT "_OrganizationToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ContactToList" ADD CONSTRAINT "_ContactToList_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ContactToList" ADD CONSTRAINT "_ContactToList_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CompanyToContact" ADD CONSTRAINT "_CompanyToContact_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CompanyToContact" ADD CONSTRAINT "_CompanyToContact_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
