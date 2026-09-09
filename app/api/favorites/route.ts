import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { toggleFavorite } from "@/lib/favorite";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Musisz być zalogowany" },
      { status: 401 },
    );
  }

  const { recipeId } = await req.json();

  if (!recipeId) {
    return NextResponse.json({ error: "Brak recipeId" }, { status: 400 });
  }

  await toggleFavorite(session.user.id, recipeId);

  return NextResponse.json({ success: true });
}
