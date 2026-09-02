"use client";

import { useEffect, useState } from "react";
import styles from "./EditRecipeForm.module.scss";
import StepsSection from "../StepsSection";
import IngredientsSection from "../IngredientsSection";
import { useRouter } from "next/navigation";

export default function EditRecipeForm({
  recipe,
  setEdit,
}: {
  recipe: any;
  setEdit: (edit: boolean) => void;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(0);
  const [servings, setServings] = useState(1);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [ingredients, setIngredients] = useState<
    { id: string; name: string; amount: string }[]
  >([{ id: "1", name: "", amount: "" }]);

  const [steps, setSteps] = useState<{ id: string; text: string }[]>([
    { id: "1", text: "" },
  ]);

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setDescription(recipe.description ?? "");
      setTime(recipe.time ?? 0);
      setServings(recipe.servings ?? 1);
      setCalories(recipe.calories ?? 0);
      setProtein(recipe.protein ?? 0);

      setIngredients(recipe.ingredients);
      setSteps(recipe.steps);
    }
  }, [recipe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      title,
      description,
      time,
      servings,
      calories,
      protein,
      ingredients,
      steps,
    };

    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      const updatedRecipe = await response.json();

      console.log("Recipe updated:", updatedRecipe);
      setEdit(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.recipe}>
        <img
          src={recipe.image || "/placeholder.jpg"}
          alt={recipe.title}
          className={styles.image}
        />
        <div className={styles.info}>
          <label>Tytuł:</label>
          <input
            className={styles.titleInput}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Opis:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.stats}>
          <label className={styles.statLabel}>Czas:</label>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
          />
          <label className={styles.statLabel}>Porcje:</label>
          <input
            type="text"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
          />
          <label className={styles.statLabel}>Kalorie:</label>
          <input
            type="text"
            value={calories}
            onChange={(e) => setCalories(Number(e.target.value))}
          />
        </div>
        <IngredientsSection
          ingredients={ingredients}
          setIngredients={setIngredients}
        />
        <div className={`${styles.card} ${styles.nutritionCard}`}>
          <p className={styles.cardTitle}>Wartości odżywcze</p>
          <ul className={styles.nutritionList}>
            <li>
              Kalorie:{" "}
              <input
                type="text"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
              />
            </li>

            <li>
              Białko:{" "}
              <input
                type="text"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
              />
            </li>
          </ul>
        </div>
        <StepsSection steps={steps} setSteps={setSteps} />
      </div>

      <button type="submit" className={styles.saveButton}>
        Zapisz zmiany
      </button>
    </form>
  );
}
