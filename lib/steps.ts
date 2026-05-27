import { prisma } from "./prisma";

export async function addSteps(recipeId: string, steps: { text: string }[]) {
  return prisma.recipeStep.createMany({
    data: steps.map((step, index) => ({
      text: step.text,
      order: index + 1,
      recipeId,
    })),
  });
}

export async function getSteps(recipeId: string) {
  return prisma.recipeStep.findMany({
    where: { recipeId },
    orderBy: { order: "asc" },
  });
}
