"use client";

import Image from "next/image";
import styles from "./form.module.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";
import IngredientsSection from "@/components/IngredientsSection";
import StepsSection from "@/components/StepsSection";
import {
  validateNumber,
  validateRequired,
  type FieldErrors,
} from "@/lib/validation";

export default function AddRecipeForm({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<
    { id: string; name: string; amount: string }[]
  >([{ id: "1", name: "", amount: "" }]);
  const [steps, setSteps] = useState<{ id: string; text: string }[]>([
    { id: "1", text: "" },
  ]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setFieldErrors((current) => ({ ...current, image: "Wybierz plik graficzny." }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors((current) => ({
          ...current,
          image: "Zdjęcie może mieć maksymalnie 5 MB.",
        }));
        return;
      }

      setFieldErrors((current) => ({ ...current, image: "" }));
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
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = String(formData.get("recipeTitle") || "");
    const summary = String(formData.get("summary") || "");
    const prepTime = String(formData.get("prepTime") || "");
    const servings = String(formData.get("servings") || "");
    const calories = String(formData.get("calories") || "");
    const protein = String(formData.get("protein") || "");
    const nextFieldErrors: FieldErrors = {
      title: validateRequired(title, "Tytuł przepisu"),
      summary: validateRequired(summary, "Opis przepisu"),
      prepTime: validateNumber(prepTime, "Czas przygotowania", { min: 0, integer: true, required: true }),
      servings: validateNumber(servings, "Liczba porcji", { min: 1, integer: true, required: true }),
      calories: validateNumber(calories, "Kalorie", { min: 0, required: true }),
      protein: validateNumber(protein, "Białko", { min: 0, required: true }),
      image: fieldErrors.image || (imageBase64 ? "" : "Zdjęcie przepisu jest wymagane."),
      ingredients: "",
      steps: "",
    };

    if (!ingredients.length) {
      nextFieldErrors.ingredients = "Dodaj co najmniej jeden składnik.";
    } else if (ingredients.some((ingredient) => !ingredient.name.trim() || !ingredient.amount.trim())) {
      nextFieldErrors.ingredients = "Uzupełnij nazwę i ilość każdego składnika.";
    }
    if (!steps.length) {
      nextFieldErrors.steps = "Dodaj co najmniej jeden krok przygotowania.";
    } else if (steps.some((step) => !step.text.trim())) {
      nextFieldErrors.steps = "Uzupełnij treść każdego kroku przygotowania.";
    }

    setFieldErrors(nextFieldErrors);
    if (Object.values(nextFieldErrors).some(Boolean)) return;

    setSaving(true);

    try {
      const userRes = await fetch("/api/getUserId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!userRes.ok) {
        setError(
          "Nie udało się znaleźć Twojego konta. Odśwież stronę i spróbuj ponownie.",
        );
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
          calories: Number(formData.get("calories")) || undefined,
          protein: Number(formData.get("protein")) || undefined,
          time: Number(formData.get("prepTime")) || undefined,
          servings: Number(formData.get("servings")) || 1,
          authorId: authorId,
          ingredients: ingredients,
          steps: steps,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Nie udało się zapisać przepisu.");
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Błąd dodawania przepisu:", error);
      setError("Wystąpił problem z połączeniem. Spróbuj ponownie.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <div className={styles.error} role="alert">
          <strong>Nie udało się zapisać przepisu</strong>
          <p>{error}</p>
        </div>
      )}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Podstawowe Informacje</h2>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="recipeTitle">
            Tytuł Przepisu
          </label>
          <input
            className={`${styles.input} ${fieldErrors.title ? styles.inputError : ""}`}
            type="text"
            id="recipeTitle"
            name="recipeTitle"
            placeholder="np. Spaghetti Carbonara"
            aria-invalid={Boolean(fieldErrors.title)}
          />
          {fieldErrors.title && <p className={styles.fieldError}>{fieldErrors.title}</p>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="summary">
            Krótki Opis
          </label>
          <textarea
            className={`${styles.textarea} ${fieldErrors.summary ? styles.inputError : ""}`}
            id="summary"
            name="summary"
            placeholder="Krótki opis Twojego przepisu..."
            aria-invalid={Boolean(fieldErrors.summary)}
          />
          {fieldErrors.summary && <p className={styles.fieldError}>{fieldErrors.summary}</p>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="recipeImage">
            Zdjęcie Przepisu
          </label>
          <input
            className={`${styles.input} ${fieldErrors.image ? styles.inputError : ""}`}
            type="file"
            id="recipeImage"
            name="recipeImage"
            accept="image/*"
            onChange={handleImageChange}
            disabled={saving}
          />
          {fieldErrors.image && <p className={styles.fieldError}>{fieldErrors.image}</p>}
          {imagePreview && (
            <div className={styles.imagePreview}>
              <Image
                src={imagePreview}
                alt="Preview"
                width={640}
                height={480}
                unoptimized
              />
            </div>
          )}
        </div>

        <div className={styles.twoColumn}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="prepTime">
              Czas Przygotowania (minuty)
            </label>
            <input
              className={`${styles.input} ${fieldErrors.prepTime ? styles.inputError : ""}`}
              type="number"
              id="prepTime"
              name="prepTime"
              placeholder="30"
              min="0"
              step="0.1"
              aria-invalid={Boolean(fieldErrors.prepTime)}
            />
            {fieldErrors.prepTime && <p className={styles.fieldError}>{fieldErrors.prepTime}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="servings">
              Porcje
            </label>
            <input
              className={`${styles.input} ${fieldErrors.servings ? styles.inputError : ""}`}
              type="number"
              min="1"
              step="1"
              id="servings"
              name="servings"
              placeholder="4"
              aria-invalid={Boolean(fieldErrors.servings)}
            />
            {fieldErrors.servings && <p className={styles.fieldError}>{fieldErrors.servings}</p>}
          </div>
        </div>
      </section>

      <IngredientsSection
        ingredients={ingredients}
        setIngredients={setIngredients}
        error={fieldErrors.ingredients}
        disabled={saving}
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
          Podsumowanie Wartości Odżywczych
        </h2>
        <p className={styles.calorieSubtext}>
          Informacje odżywcze dla tego przepisu
        </p>

        <div className={styles.twoColumn}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="calories">
              Kalorie całego przepisu
            </label>
            <input
              className={`${styles.input} ${fieldErrors.calories ? styles.inputError : ""}`}
              type="number"
              min="0"
              step="1"
              id="calories"
              name="calories"
              placeholder="np. 1200"
              aria-invalid={Boolean(fieldErrors.calories)}
            />
            {fieldErrors.calories && <p className={styles.fieldError}>{fieldErrors.calories}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="protein">
              Białko całego przepisu
            </label>
            <input
              className={`${styles.input} ${fieldErrors.protein ? styles.inputError : ""}`}
              type="number"
              min="0"
              step="0.1"
              id="protein"
              name="protein"
              placeholder="np. 60"
              aria-invalid={Boolean(fieldErrors.protein)}
            />
            {fieldErrors.protein && <p className={styles.fieldError}>{fieldErrors.protein}</p>}
          </div>
        </div>
      </section>

      <StepsSection
        steps={steps}
        setSteps={setSteps}
        error={fieldErrors.steps}
        disabled={saving}
      />

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton} disabled={saving}>
          {saving && <span className={styles.spinner} aria-hidden="true" />}
          {saving ? "Zapisywanie..." : "Zapisz Przepis"}
        </button>
      </div>
    </form>
  );
}
