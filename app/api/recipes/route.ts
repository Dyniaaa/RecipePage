import { getRecipes } from "@/lib/recipe";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const recipes = await getRecipes(search);

  return Response.json(recipes);
}
