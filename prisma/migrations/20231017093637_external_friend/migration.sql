-- CreateTable
CREATE TABLE "ExternalFriend" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "outstandingBalance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ExternalFriend_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExternalFriend" ADD CONSTRAINT "ExternalFriend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
