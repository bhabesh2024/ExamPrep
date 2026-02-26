-- CreateTable
CREATE TABLE "FlaggedQuestion" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlaggedQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FlaggedQuestion" ADD CONSTRAINT "FlaggedQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
