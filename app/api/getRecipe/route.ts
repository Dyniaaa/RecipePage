import { getRecipeByTitle } from "@/lib/recipe";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const recipe = await getRecipeByTitle(search);

  return Response.json(recipe);
}
