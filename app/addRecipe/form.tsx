"use client";

import styles from "./form.module.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";
import IngredientsSection from "@/components/IngredientsSection";
import StepsSection from "@/components/StepsSection";

export default function AddRecipeForm({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<
    { id: string; name: string; amount: string; calories: string }[]
  >([{ id: "1", name: "", amount: "", calories: "" }]);
  const [steps, setSteps] = useState<{ id: string; text: string }[]>([
    { id: "1", text: "" },
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setImageBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const userRes = await fetch("/api/getUserId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail }),
    });

    if (!userRes.ok) {
      alert("Nie udało się pobrać ID użytkownika");
      return;
    }

    const userData = await userRes.json();
    const authorId = userData.id;

    const res = await fetch("/api/addRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.get("recipeTitle"),
        description: formData.get("summary"),
        image: imageBase64,
        authorId: authorId,
        ingredients: ingredients,
        steps: steps,
      }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Failed to add recipe");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Podstawowe Informacje</h2>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="recipeTitle">
            Tytuł Przepisu
          </label>
          <input
            className={styles.input}
            type="text"
            id="recipeTitle"
            name="recipeTitle"
            placeholder="np. Spaghetti Carbonara"
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="summary">
            Krótki Opis
          </label>
          <textarea
            className={styles.textarea}
            id="summary"
            name="summary"
            placeholder="Krótki opis Twojego przepisu..."
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="recipeImage">
            Zdjęcie Przepisu
          </label>
          <input
            className={styles.input}
            type="file"
            id="recipeImage"
            name="recipeImage"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className={styles.twoColumn}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="prepTime">
              Czas Przygotowania (minuty)
            </label>
            <input
              className={styles.input}
              type="number"
              id="prepTime"
              name="prepTime"
              placeholder="30"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="servings">
              Porcje
            </label>
            <input
              className={styles.input}
              type="number"
              id="servings"
              name="servings"
              placeholder="4"
            />
          </div>
        </div>
      </section>

      <IngredientsSection
        ingredients={ingredients}
        setIngredients={setIngredients}
      />

      <section className={styles.calorieSection}>
        <h2 className={styles.calorieTitle}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C12 2 13 5 10 8C8 10 7 12 7 14C7 17.866 10.134 21 14 21C17.866 21 21 17.866 21 14C21 10 18 8 16 6C16.5 9 14 10 14 10C14 10 14 7 12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinejoin="round"
            />
          </svg>
          Podsumowanie Kalorii
        </h2>
        <p className={styles.calorieSubtext}>
          Informacje odżywcze dla tego przepisu
        </p>

        <div className={styles.calorieRow}>
          <span>Kalorie:</span>
          <span className={styles.calorieValue}>0 cal</span>
        </div>

        <div className={styles.calorieRow}>
          <span>Na porcję:</span>
          <span className={styles.calorieValue}>0 cal</span>
        </div>

        <div className={styles.calorieRow}>
          <span>Podział:</span>
          <span className={styles.calorieValue}>0 cal</span>
        </div>
      </section>

      <StepsSection steps={steps} setSteps={setSteps} />

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          Zapisz Przepis
        </button>
      </div>
    </form>
  );
}
