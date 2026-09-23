"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./SlugDetails.module.scss";
import Link from "next/link";
import EditRecipeForm from "./EditRecipeForm";
import { FavoriteButton } from "../favoriteButton";
import type { RecipeDetails } from "@/types/recipe";

export default function SlugDetailsClient({
  recipe,
  isFavorite,
  canEdit,
}: {
  recipe: RecipeDetails;
  isFavorite: boolean;
  canEdit: boolean;
}) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <header className={styles.slugHeader}>
        <Link className={styles.backLink} href="/">
          ← Powrót do przepisów
        </Link>

        <div className={styles.headerActions}>
          <FavoriteButton recipeId={recipe.id} isFavorite={isFavorite} />

          {canEdit && (
            <button className={styles.editButton} onClick={() => setEdit(!edit)}>
              Edytuj przepis
            </button>
          )}
        </div>
      </header>

      {!edit || !canEdit ? (
        <div className={styles.recipe}>
          <Image
            src={recipe.image || "/placeholder.jpg"}
            alt={recipe.title}
            className={styles.image}
            width={960}
            height={640}
            unoptimized
          />

          <div className={styles.info}>
            <h1 className={styles.title}>{recipe.title}</h1>
            <p className={styles.description}>{recipe.description}</p>
          </div>

          <div className={styles.stats}>
            <p className={styles.stat}>{recipe.time ?? 0} min</p>
            <p className={styles.stat}>{recipe.servings} porcji</p>
            <p className={styles.stat}>{Number(recipe.calories ?? 0).toFixed(1)} kcal</p>
          </div>

          <div className={styles.content}>
            <div className={styles.card}>
              <p className={styles.cardTitle}>Składniki</p>

              <ul className={styles.ingredients}>
                {recipe.ingredients.map((ing) => (
                  <li className={styles.ingredient} key={ing.id}>
                    <p className={styles.ingredientName}>
                      {ing.name} - {ing.amount}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${styles.card} ${styles.nutritionCard}`}>
              <p className={styles.cardTitle}>Wartości odżywcze</p>

              <ul className={styles.nutritionList}>
                <li>
                  Kalorie: <span>{Number(recipe.calories ?? 0).toFixed(1)} kcal</span>
                </li>

                <li>
                  Kalorie na porcję:
                  <span>
                    {" "}
                    {recipe.calories
                      ? (recipe.calories / recipe.servings).toFixed(1)
                      : 0}{" "}
                    kcal
                  </span>
                </li>

                <li>
                  Białko: <span>{recipe.protein ?? 0} g</span>
                </li>

                <li>
                  Białko na porcję:
                  <span>
                    {" "}
                    {recipe.protein
                      ? (recipe.protein / recipe.servings).toFixed(1)
                      : 0}{" "}
                    g
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.instructions}>
            <p className={styles.sectionTitle}>Instrukcje</p>

            <ol className={styles.steps}>
              {recipe.steps.map((step) => (
                <li key={step.id}>{step.text}</li>
              ))}
            </ol>
          </div>

          <div className={styles.comments}>Comments</div>
        </div>
      ) : (
        <EditRecipeForm recipe={recipe} setEdit={setEdit} />
      )}
    </>
  );
}
