import { getRecipes } from "@/lib/recipe";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const recipes = await getRecipes(search);

    return Response.json(recipes);
  } catch (error) {
    console.error("Błąd pobierania przepisów:", error);
    return Response.json(
      { message: "Nie udało się pobrać przepisów" },
      { status: 500 },
    );
  }
}
