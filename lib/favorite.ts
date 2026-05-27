import { prisma } from "./prisma";

export async function toggleFavorite(userId: string, recipeId: string) {
  const existing = await prisma.favorite.findFirst({
    where: { userId, recipeId },
  });

  if (existing) {
    return prisma.favorite.delete({
      where: { id: existing.id },
    });
  }

  return prisma.favorite.create({
    data: {
      userId,
      recipeId,
    },
  });
}

export async function getUserFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      recipe: true,
    },
  });
}
