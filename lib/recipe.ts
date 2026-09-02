import { prisma } from "./prisma";

export async function createRecipe(data: {
  title: string;
  description?: string;
  image?: string;
  calories?: number;
  protein?: number;
  time?: number;
  servings?: number;
  authorId: string;
  ingredients: { name: string; amount: string }[];
  steps: { text: string }[];
}) {
  return prisma.recipe.create({
    data: {
      title: data.title,
      description: data.description,
      image: data.image,
      calories: data.calories,
      time: data.time,
      protein: data.protein,
      servings: data.servings || 1,
      authorId: data.authorId,

      ingredients: {
        create: data.ingredients.map(({ name, amount }) => ({
          name,
          amount,
        })),
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
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              ingredients: {
                some: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
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

export async function getRecipeById(id: string) {
  return prisma.recipe.findFirst({
    where: {
      id,
    },
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

export async function updateRecipe(
  id: string,
  data: {
    title: string;
    description?: string;
    image?: string;
    calories?: number;
    protein?: number;
    time?: number;
    servings?: number;
    ingredients: { name: string; amount: string }[];
    steps: { text: string }[];
  },
) {
  const recipe = await prisma.recipe.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      image: data.image,
      calories: data.calories,
      time: data.time,
      protein: data.protein,
      servings: data.servings || 1,
      ingredients: {
        deleteMany: {},
        create: data.ingredients.map(({ name, amount }) => ({
          name,
          amount,
        })),
      },
      steps: {
        deleteMany: {},
        create: data.steps.map((step, index) => ({
          text: step.text,
          order: index + 1,
        })),
      },
    },
  });
  return recipe;
}
