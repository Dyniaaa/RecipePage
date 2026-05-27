import { prisma } from "./prisma";

export async function addComment(data: {
  content: string;
  userId: string;
  recipeId: string;
}) {
  return prisma.comment.create({
    data,
  });
}

export async function getComments(recipeId: string) {
  return prisma.comment.findMany({
    where: { recipeId },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
