-- CreateTable
CREATE TABLE "public"."Waitlist" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "doubleOptIn" BOOLEAN NOT NULL DEFAULT false,
    "confirmationCode" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrerId" INTEGER,
    "referralCode" TEXT NOT NULL,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_email_key" ON "public"."Waitlist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_confirmationCode_key" ON "public"."Waitlist"("confirmationCode");

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_referrerId_key" ON "public"."Waitlist"("referrerId");

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_referralCode_key" ON "public"."Waitlist"("referralCode");

-- AddForeignKey
ALTER TABLE "public"."Waitlist" ADD CONSTRAINT "Waitlist_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "public"."Waitlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
