"use client";

import { useState } from "react";
import styles from "./favoriteButton.module.scss";

export function FavoriteButton({
  recipeId,
  isFavorite,
}: {
  recipeId: string;
  isFavorite: boolean;
}) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFavorite() {
    try {
      setLoading(true);
      setError("");

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
        const data = await response.json().catch(() => null);
        setError(data?.message || "Nie udało się zmienić ulubionych.");
        return;
      }

      setFavorite((prev) => !prev);
    } catch (error) {
      console.error(error);
      setError("Wystąpił problem z połączeniem. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <button onClick={handleFavorite} disabled={loading} className={styles.favoriteButton}>
        {favorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      </button>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
