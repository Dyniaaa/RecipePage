import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const image = formData.get("image") as File | null;

    if (!id) {
      return NextResponse.json(
        { error: "Brak ID użytkownika" },
        { status: 400 },
      );
    }

    let imageUrl: string | undefined;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const extension = image.type.split("/")[1] || "jpg";
      const fileName = `${crypto.randomUUID()}.${extension}`;

      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "profiles",
      );

      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);

      imageUrl = `/uploads/profiles/${fileName}`;
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        ...(imageUrl ? { image: imageUrl } : {}),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Nie udało się zmienić danych" },
      { status: 500 },
    );
  }
}
