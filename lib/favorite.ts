import { prisma } from "./prisma";

export async function toggleFavorite(userId: string, recipeId: string) {
  const existing = await prisma.favorite.findFirst({
    where: {
      userId,
      recipeId,
    },
  });

  if (existing) {
    return prisma.favorite.delete({
      where: {
        id: existing.id,
      },
    });
  }

  return prisma.favorite.create({
    data: {
      userId,
      recipeId,
    },
  });
}

export async function isFavorite(userId: string, recipeId: string) {
  const favorite = await prisma.favorite.findFirst({
    where: {
      userId,
      recipeId,
    },
  });

  return !!favorite;
}

export async function getUserFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
    },
    include: {
      recipe: true,
    },
  });

  return favorites.map((favorite) => favorite.recipe);
}
