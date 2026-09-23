import { prisma } from "./prisma";

export async function getCalendarEntries(userId: string, start: string, end: string) {
  return prisma.calendarEntry.findMany({
    where: { userId, date: { gte: start, lte: end } },
    include: { recipe: { select: { id: true, title: true, image: true, calories: true, protein: true, servings: true } } },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });
}

export async function saveCalendarEntry(
  userId: string,
  data: { date: string; recipeId: string; servings: number },
) {
  return prisma.calendarEntry.upsert({
    where: { userId_date_recipeId: { userId, date: data.date, recipeId: data.recipeId } },
    update: { servings: data.servings },
    create: { userId, date: data.date, recipeId: data.recipeId, servings: data.servings },
    include: { recipe: { select: { id: true, title: true, image: true, calories: true, protein: true, servings: true } } },
  });
}

export async function deleteCalendarEntry(userId: string, id: string) {
  return prisma.calendarEntry.deleteMany({ where: { id, userId } });
}
