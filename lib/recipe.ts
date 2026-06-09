import { prisma } from "./prisma";

export async function createRecipe(data: {
  title: string;
  description?: string;
  image?: string;
  authorId: string;
  ingredients: { name: string; amount: string; calories: string }[];
  steps: { text: string }[];
}) {
  return prisma.recipe.create({
    data: {
      title: data.title,
      description: data.description,
      image: data.image,
      authorId: data.authorId,

      ingredients: {
        create: data.ingredients,
      },

      steps: {
        create: data.steps.map((step, index) => ({
          text: step.text,
          order: index + 1,
        })),
      },
    },
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

export async function getRecipeByAuthor(authorId: string) {
  return prisma.recipe.findMany({
    where: { authorId },
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
