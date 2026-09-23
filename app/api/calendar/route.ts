import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteCalendarEntry, getCalendarEntries, saveCalendarEntry } from "@/lib/calendar";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

async function getUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id;
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Brak autoryzacji" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start") || "";
    const end = searchParams.get("end") || "";
    if (!datePattern.test(start) || !datePattern.test(end)) {
      return NextResponse.json({ message: "Nieprawidłowy zakres dat" }, { status: 400 });
    }

    return NextResponse.json(await getCalendarEntries(userId, start, end));
  } catch (error) {
    console.error("Błąd pobierania kalendarza:", error);
    return NextResponse.json({ message: "Nie udało się pobrać kalendarza" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Brak autoryzacji" }, { status: 401 });

    const body = await req.json();
    const servings = Number(body.servings);
    if (
      !datePattern.test(String(body.date)) ||
      !body.recipeId ||
      !Number.isFinite(servings) ||
      servings < 0.25 ||
      Math.round(servings * 100) % 25 !== 0
    ) {
      return NextResponse.json({ message: "Nieprawidłowa data, przepis lub liczba porcji" }, { status: 400 });
    }

    const entry = await saveCalendarEntry(userId, {
      date: body.date,
      recipeId: body.recipeId,
      servings,
    });
    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Nie udało się dodać przepisu do kalendarza" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ message: "Brak autoryzacji" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "Brak wpisu" }, { status: 400 });
    await deleteCalendarEntry(userId, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Błąd usuwania wpisu z kalendarza:", error);
    return NextResponse.json({ message: "Nie udało się usunąć wpisu" }, { status: 500 });
  }
}
