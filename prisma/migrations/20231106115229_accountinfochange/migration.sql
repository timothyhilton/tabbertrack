-- CreateTable
CREATE TABLE "ExternalTransaction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalFriendId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "doesUserOwe" BOOLEAN NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ExternalTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountInfoChangeAttempt" (
    "id" SERIAL NOT NULL,
    "verificationToken" TEXT NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "newName" TEXT NOT NULL,
    "newUsername" TEXT NOT NULL,
    "newEmail" TEXT NOT NULL,
    "newPasswordHash" TEXT NOT NULL,

    CONSTRAINT "AccountInfoChangeAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountInfoChangeAttempt_verificationToken_key" ON "AccountInfoChangeAttempt"("verificationToken");

-- AddForeignKey
ALTER TABLE "ExternalTransaction" ADD CONSTRAINT "ExternalTransaction_externalFriendId_fkey" FOREIGN KEY ("externalFriendId") REFERENCES "ExternalFriend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalTransaction" ADD CONSTRAINT "ExternalTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountInfoChangeAttempt" ADD CONSTRAINT "AccountInfoChangeAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
