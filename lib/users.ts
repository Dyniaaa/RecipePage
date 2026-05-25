import { prisma } from "./prisma";

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  return await prisma.app_users.create({
    data: {
      name,
      email,
      password,
    },
  });
}
