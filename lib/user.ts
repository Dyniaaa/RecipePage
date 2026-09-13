import { prisma } from "./prisma";

export async function createUser(
  name: string,
  email: string,
  password: string,
  verificationToken: string,
  verificationExpiry: Date,
) {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
      verificationToken,
      verificationExpiry,
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}
