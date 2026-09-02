import { NextResponse } from "next/server";
import { updateRecipe } from "@/lib/recipe";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const recipe = await updateRecipe(id, body);

    return NextResponse.json({
      message: "Recipe updated successfully",
      recipe,
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
