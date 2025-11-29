/*
  Warnings:

  - You are about to drop the `NodeExecutiom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NodeExecutiom" DROP CONSTRAINT "NodeExecutiom_executionId_fkey";

-- DropTable
DROP TABLE "NodeExecutiom";

-- CreateTable
CREATE TABLE "NodeExecution" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "status" "ExecutionStatus" NOT NULL,
    "output" JSONB,
    "error" JSONB,

    CONSTRAINT "NodeExecution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NodeExecution_executionId_nodeId_idx" ON "NodeExecution"("executionId", "nodeId");

-- AddForeignKey
ALTER TABLE "NodeExecution" ADD CONSTRAINT "NodeExecution_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "Execution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
