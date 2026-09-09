import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { id, name, email, image } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Brak ID użytkownika" },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        image,
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
