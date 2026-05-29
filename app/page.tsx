"use client";

import { useState, useEffect } from "react";
import RecipesMap from "@/components/recipesMap";
import styles from "./page.module.scss";

export default function Home() {
  const [searchQuery, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/recipes?search=${searchQuery}`);
      const data = await res.json();
      setRecipes(data);
      setLoading(false);
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

              <circle
                cx="60"
                cy="60"
                r="22"
                stroke="#EC4899"
                strokeWidth="4"
              />

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
