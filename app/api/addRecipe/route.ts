import { NextResponse } from "next/server";
import { createRecipe } from "@/lib/recipe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, image, authorId } = body;

    if (!title || !authorId) {
      return NextResponse.json(
        { message: "Brak wymaganych pól" },
        { status: 400 },
      );
    }

    const recipe = await createRecipe({
      title,
      description,
      image,
      authorId,
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
