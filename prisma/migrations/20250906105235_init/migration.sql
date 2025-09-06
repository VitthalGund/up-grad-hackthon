-- CreateEnum
CREATE TYPE "public"."SubscriptionTier" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "public"."NodeType" AS ENUM ('VIDEO', 'ARTICLE', 'QUIZ', 'INTERACTIVE');

-- CreateEnum
CREATE TYPE "public"."InteractionType" AS ENUM ('CONTENT_VIEW', 'QUIZ_ATTEMPT', 'HINT_USED', 'CONFIDENCE_RATED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "hashedPassword" TEXT NOT NULL,
    "subscriptionTier" "public"."SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "hintCredits" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContentNode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "nodeType" "public"."NodeType" NOT NULL,
    "contentJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserInteraction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentNodeId" TEXT NOT NULL,
    "interactionType" "public"."InteractionType" NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LearnerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "engagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "competenceMap" JSONB NOT NULL,
    "misconceptionClusters" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LearnerReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportData" JSONB NOT NULL,

    CONSTRAINT "LearnerReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_KnowledgeGraph" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_KnowledgeGraph_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LearnerProfile_userId_key" ON "public"."LearnerProfile"("userId");

-- CreateIndex
CREATE INDEX "_KnowledgeGraph_B_index" ON "public"."_KnowledgeGraph"("B");

-- AddForeignKey
ALTER TABLE "public"."UserInteraction" ADD CONSTRAINT "UserInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInteraction" ADD CONSTRAINT "UserInteraction_contentNodeId_fkey" FOREIGN KEY ("contentNodeId") REFERENCES "public"."ContentNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearnerProfile" ADD CONSTRAINT "LearnerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearnerReport" ADD CONSTRAINT "LearnerReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_KnowledgeGraph" ADD CONSTRAINT "_KnowledgeGraph_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."ContentNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_KnowledgeGraph" ADD CONSTRAINT "_KnowledgeGraph_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."ContentNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
