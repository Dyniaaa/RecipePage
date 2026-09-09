import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isFavorite } from "@/lib/favorite";
import SlugDetailsClient from "./SlugDetailsClient";

export default async function SlugDetails({ recipe }: { recipe: any }) {
  const session = await getServerSession(authOptions);

  let favorite = false;

  if (session?.user?.id) {
    favorite = await isFavorite(session.user.id, recipe.id);
  }

  return <SlugDetailsClient recipe={recipe} isFavorite={favorite} />;
}
