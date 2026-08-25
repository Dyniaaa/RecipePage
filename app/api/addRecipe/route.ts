import { NextResponse } from "next/server";
import { createRecipe } from "@/lib/recipe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      image,
      calories,
      protein,
      time,
      servings,
      authorId,
      ingredients,
      steps,
    } = body;

    if (!title || !authorId) {
      return NextResponse.json(
        { message: "Brak wymaganych pól" },
        { status: 400 },
      );
    }

    const parsedCalories = calories ? Number(calories) : undefined;
    const parsedProtein = protein ? Number(protein) : undefined;
    const parsedServings = servings ? Number(servings) : 1;

    if (
      (parsedCalories !== undefined && !Number.isFinite(parsedCalories)) ||
      (parsedProtein !== undefined && !Number.isFinite(parsedProtein)) ||
      !Number.isInteger(parsedServings) ||
      parsedServings < 1
    ) {
      return NextResponse.json(
        { message: "Nieprawidłowe wartości odżywcze lub liczba porcji" },
        { status: 400 },
      );
    }

    const recipe = await createRecipe({
      title,
      description,
      image,
      calories: parsedCalories,
      protein: parsedProtein,
      time: time ? Number(time) : undefined,
      servings: parsedServings,
      authorId,
      ingredients,
      steps,
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
