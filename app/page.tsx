"use client";

import { useState, useEffect } from "react";
import RecipesMap from "@/components/recipesMap";
import styles from "./page.module.scss";

type Recipe = {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  time?: number;
  servings?: number;
  calories?: number | null;
};

export default function Home() {
  const [searchQuery, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/recipes?search=${encodeURIComponent(searchQuery)}`,
        );

        if (!res.ok) {
          setError("Nie udało się pobrać przepisów. Spróbuj ponownie.");
          setRecipes([]);
          return;
        }

        const data = await res.json();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Błąd pobierania przepisów:", error);
        setError("Nie udało się połączyć z serwerem. Spróbuj ponownie.");
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  return (
    <main className={styles.mainHome}>
      <div className={styles.container}>
        <p className={styles.title}>Kolekcja przepisów</p>
        <p className={styles.subtitle}>Odkrywaj nowe smaki</p>
        <input
          className={styles.searchInput}
          placeholder="Szukaj przepisu..."
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading ? (
          <div className={styles.loader}></div>
        ) : error ? (
          <div className={styles.error} role="alert">
            <strong>Coś poszło nie tak</strong>
            <p>{error}</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className={styles.noResults}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
            >
              <circle cx="60" cy="60" r="50" fill="#FCE7F3" />

              <circle cx="60" cy="60" r="22" stroke="#EC4899" strokeWidth="4" />

              <path
                d="M35 38V50"
                stroke="#EC4899"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M31 38V46"
                stroke="#EC4899"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M39 38V46"
                stroke="#EC4899"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M35 50V82"
                stroke="#EC4899"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <path
                d="M85 38C90 45 90 55 85 62"
                stroke="#EC4899"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M85 62V82"
                stroke="#EC4899"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <line
                x1="52"
                y1="52"
                x2="68"
                y2="68"
                stroke="#EC4899"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="68"
                y1="52"
                x2="52"
                y2="68"
                stroke="#EC4899"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <p>Brak przepisów dla wyszukiwania: {searchQuery}</p>
          </div>
        ) : (
          <RecipesMap recipes={recipes} />
        )}
      </div>
    </main>
  );
}
