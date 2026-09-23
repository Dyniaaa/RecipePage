import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { updateRecipe } from "@/lib/recipe";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Brak autoryzacji" },
        { status: 401 },
      );
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!recipe) {
      return NextResponse.json(
        { message: "Nie znaleziono przepisu" },
        { status: 404 },
      );
    }

    if (recipe.authorId !== session.user.id) {
      return NextResponse.json(
        { message: "Tylko twórca przepisu może go edytować" },
        { status: 403 },
      );
    }

    const body = await req.json();

    const updatedRecipe = await updateRecipe(id, body);

    return NextResponse.json({
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
    });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
