"use client";

import { useState } from "react";
import styles from "./SlugDetails.module.scss";
import Link from "next/link";
import EditRecipeForm from "./EditRecipeForm";

export default function SlugDetails({ recipe }: { recipe: any }) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <header className={styles.slugHeader}>
        <Link className={styles.backLink} href="/">
          ← Back to Recipes
        </Link>
        <div>
          <button>Like</button>
          <button onClick={() => setEdit(!edit)}>Edit Recipe</button>
        </div>
      </header>

      {!edit ? (
        <div className={styles.recipe}>
          <img
            src={recipe.image || "/placeholder.jpg"}
            alt={recipe.title}
            className={styles.image}
          />
          <div className={styles.info}>
            <h1 className={styles.title}>{recipe.title}</h1>
            <p className={styles.description}>{recipe.description}</p>
          </div>
          <div className={styles.stats}>
            <p className={styles.stat}>{recipe.time ?? 0} min</p>
            <p className={styles.stat}>{recipe.servings} porcji</p>
            <p className={styles.stat}>{recipe.calories ?? 0} kcal</p>
          </div>
          <div className={styles.content}>
            <div className={styles.card}>
              <p className={styles.cardTitle}>ingredients</p>
              <ul className={styles.ingredients}>
                {recipe.ingredients.map((ing: any) => (
                  <li className={styles.ingredient} key={ing.id}>
                    <p className={styles.ingredientName}>
                      {ing.name} - {ing.amount}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${styles.card} ${styles.nutritionCard}`}>
              <p className={styles.cardTitle}>Nutrition Facts</p>
              <ul className={styles.nutritionList}>
                <li>
                  Kalorie: <span>{recipe.calories ?? 0} kcal</span>
                </li>
                <li>
                  Kalorie na porcję:
                  <span>
                    {" "}
                    {recipe.calories
                      ? (recipe.calories / recipe.servings).toFixed(1)
                      : 0}{" "}
                    kcal{" "}
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
            <p className={styles.sectionTitle}>Instructions</p>
            <ol className={styles.steps}>
              {recipe.steps.map((step: any) => (
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
