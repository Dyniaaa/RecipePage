import { prisma } from "./prisma";

export async function createRecipe(data: {
  title: string;
  description?: string;
  image?: string;
  authorId: string;
}) {
  return prisma.recipe.create({
    data,
  });
}

export async function getRecipes(query?: string) {
  return prisma.recipe.findMany({
    where: query
      ? {
          title: {
            contains: query,
            mode: "insensitive",
          },
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      steps: true,
      ingredients: true,
    },
  });
}

export async function getRecipeById(id: string) {
  return prisma.recipe.findUnique({
    where: { id },
    include: {
      author: true,
      steps: {
        orderBy: { order: "asc" },
      },
      ingredients: true,
      comments: true,
      favorites: true,
    },
  });
}
