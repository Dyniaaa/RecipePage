import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validuj typ pliku
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Konwertuj do buffera
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generuj unikalną nazwę
    const timestamp = Date.now();
    const filename = `recipe-${timestamp}-${file.name.replace(/[^a-z0-9.]/gi, "")}`;

    // Stwórz ścieżkę do public/recipes
    const uploadDir = join(process.cwd(), "public", "recipes");
    
    // Stwórz folder jeśli nie istnieje
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // folder już istnieje
    }

    const filepath = join(uploadDir, filename);

    // Zapisz plik
    await writeFile(filepath, buffer);

    // Zwróć URL
    const url = `/recipes/${filename}`;

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
