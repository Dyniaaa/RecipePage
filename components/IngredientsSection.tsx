"use client";

import { useState } from "react";
import styles from "./IngredientsSection.module.scss";

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  calories: string;
}

export default function IngredientsSection({
  ingredients,
  setIngredients,
}: {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}) {
  const handleAddIngredient = () => {
    const newId = Date.now().toString();
    setIngredients([
      ...ingredients,
      { id: newId, name: "", amount: "", calories: "" },
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  const handleIngredientChange = (
    id: string,
    field: keyof Omit<Ingredient, "id">,
    value: string,
  ) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing,
      ),
    );
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Składniki</h2>

      <div className={styles.ingredientHeader}>
        <div className={styles.ingredientColumn}>Nazwa składnika</div>
        <div className={styles.ingredientColumn}>Ilość</div>
        <div className={styles.ingredientColumn}>Kalorie</div>
        <div className={styles.ingredientColumn}></div>
      </div>

      {ingredients.map((ingredient) => (
        <div className={styles.ingredientRow} key={ingredient.id}>
          <input
            className={styles.input}
            type="text"
            placeholder="Nazwa składnika"
            value={ingredient.name}
            onChange={(e) =>
              handleIngredientChange(ingredient.id, "name", e.target.value)
            }
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Ilość (np. 200g, 1 szklanka)"
            value={ingredient.amount}
            onChange={(e) =>
              handleIngredientChange(ingredient.id, "amount", e.target.value)
            }
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Kalorie (np. 150 cal)"
            value={ingredient.calories}
            onChange={(e) =>
              handleIngredientChange(ingredient.id, "calories", e.target.value)
            }
          />
          {ingredients.length > 1 && (
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => handleRemoveIngredient(ingredient.id)}
              title="Usuń składnik"
            >
              ×
            </button>
          )}
        </div>
      ))}

      <button
        className={styles.addButton}
        type="button"
        onClick={handleAddIngredient}
      >
        <span className={styles.plus}>+</span> Dodaj Składnik
      </button>
    </section>
  );
}
