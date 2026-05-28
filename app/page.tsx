"use client";

import { useState, useEffect } from "react";
import RecipesMap from "@/components/recipesMap";
import styles from "./page.module.scss";

export default function Home() {
  const [searchQuery, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/recipes?search=${searchQuery}`);
      const data = await res.json();
      setRecipes(data);
    };

    fetchData();
  }, [searchQuery]);

  return (
    <main className={styles.mainHome}>
      <p>Kolekcja przepisów</p>
      <p>Odkrywaj nowe smaki</p>
      <input onChange={(e) => setQuery(e.target.value)} />
      <RecipesMap recipes={recipes} />
    </main>
  );
}
