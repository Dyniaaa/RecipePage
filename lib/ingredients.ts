import { prisma } from "./prisma";

export async function addIngredients(
  recipeId: string,
  ingredients: {
    name: string;
    amount?: string;
  }[],
) {
  return prisma.ingredient.createMany({
    data: ingredients.map((ing) => ({
      ...ing,
      recipeId,
    })),
  });
}

export async function getIngredients(recipeId: string) {
  return prisma.ingredient.findMany({
    where: { recipeId },
  });
}
