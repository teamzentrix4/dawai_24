CREATE TABLE "PasswordResetChallenge" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "userId" TEXT,
  "otpHash" TEXT NOT NULL,
  "tokenHash" TEXT,
  "ipHash" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "resendAfter" TIMESTAMP(3) NOT NULL,
  "tokenExpiresAt" TIMESTAMP(3),
  "attemptCount" INTEGER NOT NULL DEFAULT 0,
  "verifiedAt" TIMESTAMP(3),
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PasswordResetChallenge_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PasswordResetChallenge_email_createdAt_idx" ON "PasswordResetChallenge"("email", "createdAt");
CREATE INDEX "PasswordResetChallenge_userId_createdAt_idx" ON "PasswordResetChallenge"("userId", "createdAt");
CREATE INDEX "PasswordResetChallenge_ipHash_createdAt_idx" ON "PasswordResetChallenge"("ipHash", "createdAt");
