"use client";

import { useState } from "react";

export function FavoriteButton({
  recipeId,
  isFavorite,
}: {
  recipeId: string;
  isFavorite: boolean;
}) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  async function handleFavorite() {
    try {
      setLoading(true);

      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId,
        }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zmienić ulubionego");
      }

      setFavorite((prev) => !prev);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleFavorite} disabled={loading}>
      {favorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
    </button>
  );
}
