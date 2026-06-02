-- CreateTable
CREATE TABLE "DbArticle" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DbArticle_pkey" PRIMARY KEY ("id")
);
