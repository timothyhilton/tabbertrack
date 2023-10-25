/*
  Warnings:

  - You are about to drop the column `doesSenderOwe` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `userWhoIsOwedId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userWhoOwesId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "doesSenderOwe",
ADD COLUMN     "userWhoIsOwedId" INTEGER NOT NULL,
ADD COLUMN     "userWhoOwesId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userWhoOwesId_fkey" FOREIGN KEY ("userWhoOwesId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userWhoIsOwedId_fkey" FOREIGN KEY ("userWhoIsOwedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
