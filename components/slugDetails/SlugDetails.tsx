import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isFavorite } from "@/lib/favorite";
import SlugDetailsClient from "./SlugDetailsClient";
import type { RecipeDetails } from "@/types/recipe";

export default async function SlugDetails({ recipe }: { recipe: RecipeDetails }) {
  const session = await getServerSession(authOptions);

  let favorite = false;

  if (session?.user?.id) {
    favorite = await isFavorite(session.user.id, recipe.id);
  }

  const canEdit = session?.user?.id === recipe.authorId;

  return (
    <SlugDetailsClient
      recipe={recipe}
      isFavorite={favorite}
      canEdit={canEdit}
    />
  );
}
