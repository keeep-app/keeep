/*
  Warnings:

  - A unique constraint covering the columns `[supabaseId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profile_supabaseId_key" ON "public"."Profile"("supabaseId");
