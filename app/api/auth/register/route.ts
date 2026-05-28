export const runtime = "nodejs";

import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { createUser } from "@/lib/user"; // sprawdź ścieżkę

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Brak wymaganych pól" },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await createUser(name, email, hashedPassword);

    return NextResponse.json(
      {
        message: "Użytkownik został zarejestrowany",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Błąd rejestracji:", error);

    return NextResponse.json({ message: "Błąd serwera" }, { status: 500 });
  }
}
