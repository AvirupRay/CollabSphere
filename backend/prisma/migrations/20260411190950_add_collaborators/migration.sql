-- CreateTable
CREATE TABLE "DocumentCollaborator" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "DocumentCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentCollaborator_documentId_userId_key" ON "DocumentCollaborator"("documentId", "userId");

-- AddForeignKey
ALTER TABLE "DocumentCollaborator" ADD CONSTRAINT "DocumentCollaborator_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentCollaborator" ADD CONSTRAINT "DocumentCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
