"use client";

import { useState } from "react";
import styles from "./profileRecipes.module.scss";
import RecipesMap from "@/components/recipesMap";

export default function ProfileRecipes({ recipes }: { recipes: any[] }) {
  const [list, setList] = useState(true);

  return (
    <section className={styles.recipesSection}>
      <div className={styles.recipesHeader}>
        <button
          onClick={() => setList(true)}
          className={list ? styles.active : ""}
        >
          My Recipes <span> {recipes.length} </span>
        </button>
        <button
          onClick={() => setList(false)}
          className={!list ? styles.active : ""}
        >
          My Favorites
        </button>
      </div>

      {list ? (
        recipes.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🍳</div>

            <p className={styles.emptyTitle}>
              Nie stworzyłeś jeszcze żadnych przepisów
            </p>

            <p className={styles.emptySubtitle}>
              Zaczynij udostępniać swoje pyszne przepisy!
            </p>
          </div>
        ) : (
          <RecipesMap recipes={recipes} />
        )
      ) : recipes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🍳</div>

          <p className={styles.emptyTitle}>
            Nie masz jeszcze ulubionych przepisów
          </p>

          <p className={styles.emptySubtitle}>
            Zaczynij odkrywać nasze przepisy!
          </p>
        </div>
      ) : (
        <RecipesMap recipes={recipes} />
      )}
    </section>
  );
}
