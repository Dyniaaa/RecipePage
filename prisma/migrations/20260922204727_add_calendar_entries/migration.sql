-- CreateTable
CREATE TABLE "CalendarEntry" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "servings" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "CalendarEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalendarEntry_userId_date_idx" ON "CalendarEntry"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarEntry_userId_date_recipeId_key" ON "CalendarEntry"("userId", "date", "recipeId");

-- AddForeignKey
ALTER TABLE "CalendarEntry" ADD CONSTRAINT "CalendarEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEntry" ADD CONSTRAINT "CalendarEntry_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
