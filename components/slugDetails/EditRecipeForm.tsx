"use client";

import { useEffect, useState } from "react";
import styles from "./EditRecipeForm.module.scss";
import StepsSection from "../StepsSection";
import IngredientsSection from "../IngredientsSection";
import { useRouter } from "next/navigation";
import {
  validateNumber,
  validateRequired,
  type FieldErrors,
} from "@/lib/validation";

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
  const [imagePreview, setImagePreview] = useState("/placeholder.jpg");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
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
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setDescription(recipe.description ?? "");
      setImagePreview(recipe.image || "/placeholder.jpg");
      setImageBase64(null);
      setTime(recipe.time ?? 0);
      setServings(recipe.servings ?? 1);
      setCalories(recipe.calories ?? 0);
      setProtein(recipe.protein ?? 0);

      setIngredients(recipe.ingredients);
      setSteps(recipe.steps);
    }
  }, [recipe]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFieldErrors((current) => ({
        ...current,
        image: "Wybierz plik graficzny.",
      }));
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const nextFieldErrors: FieldErrors = {
      title: validateRequired(title, "Tytuł przepisu"),
      description: validateRequired(description, "Opis przepisu"),
      time: validateNumber(String(time), "Czas przygotowania", { min: 0, integer: true, required: true }),
      servings: validateNumber(String(servings), "Liczba porcji", { min: 1, integer: true, required: true }),
      calories: validateNumber(String(calories), "Kalorie", { min: 0, required: true }),
      protein: validateNumber(String(protein), "Białko", { min: 0, required: true }),
      image: fieldErrors.image || (imageBase64 || recipe.image ? "" : "Zdjęcie przepisu jest wymagane."),
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

    const data = {
      title,
      description,
      time,
      servings,
      calories,
      protein,
      image: imageBase64 ?? recipe.image ?? undefined,
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
        const responseData = await response.json().catch(() => null);
        setError(responseData?.message || "Nie udało się zaktualizować przepisu.");
        return;
      }

      const updatedRecipe = await response.json();

      console.log("Recipe updated:", updatedRecipe);
      setEdit(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating recipe:", error);
      setError("Wystąpił problem z połączeniem. Spróbuj ponownie.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <div className={styles.error} role="alert">
          <strong>Nie udało się zapisać zmian</strong>
          <p>{error}</p>
        </div>
      )}
      <div className={styles.recipe}>
        <div className={styles.imageSection}>
          <img src={imagePreview} alt="Podgląd zdjęcia przepisu" className={styles.image} />
          <label className={styles.imageLabel} htmlFor="recipeImage">
            Zmień zdjęcie przepisu
          </label>
          <input
            className={`${styles.imageInput} ${fieldErrors.image ? styles.inputError : ""}`}
            type="file"
            id="recipeImage"
            name="recipeImage"
            accept="image/*"
            onChange={handleImageChange}
            disabled={saving}
            aria-invalid={Boolean(fieldErrors.image)}
          />
          {fieldErrors.image && <p className={styles.fieldError}>{fieldErrors.image}</p>}
        </div>
        <div className={styles.info}>
          <label>Tytuł:</label>
          <input
            className={`${styles.titleInput} ${fieldErrors.title ? styles.inputError : ""}`}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={Boolean(fieldErrors.title)}
          />
          {fieldErrors.title && <p className={styles.fieldError}>{fieldErrors.title}</p>}
          <label>Opis:</label>
          <textarea
            className={fieldErrors.description ? styles.inputError : ""}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-invalid={Boolean(fieldErrors.description)}
          />
          {fieldErrors.description && <p className={styles.fieldError}>{fieldErrors.description}</p>}
        </div>
        <div className={styles.stats}>
          <label className={styles.statLabel}>Czas:</label>
          <input
            className={fieldErrors.time ? styles.inputError : ""}
            type="number"
            min="0"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            aria-invalid={Boolean(fieldErrors.time)}
          />
          {fieldErrors.time && <p className={styles.fieldError}>{fieldErrors.time}</p>}
          <label className={styles.statLabel}>Porcje:</label>
          <input
            className={fieldErrors.servings ? styles.inputError : ""}
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            aria-invalid={Boolean(fieldErrors.servings)}
          />
          {fieldErrors.servings && <p className={styles.fieldError}>{fieldErrors.servings}</p>}
          <label className={styles.statLabel}>Kalorie:</label>
          <input
            className={fieldErrors.calories ? styles.inputError : ""}
            type="number"
            min="0"
              step="0.1"
              value={calories}
            onChange={(e) => setCalories(Number(e.target.value))}
            aria-invalid={Boolean(fieldErrors.calories)}
          />
          {fieldErrors.calories && <p className={styles.fieldError}>{fieldErrors.calories}</p>}
        </div>
        <IngredientsSection
          ingredients={ingredients}
          setIngredients={setIngredients}
          error={fieldErrors.ingredients}
          disabled={saving}
        />
        <div className={`${styles.card} ${styles.nutritionCard}`}>
          <p className={styles.cardTitle}>Wartości odżywcze</p>
          <ul className={styles.nutritionList}>
            <li>
              Kalorie:{" "}
              <input
                className={fieldErrors.calories ? styles.inputError : ""}
                type="number"
                min="0"
                step="0.1"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
              />
            </li>

            <li>
              Białko:{" "}
              <input
                className={fieldErrors.protein ? styles.inputError : ""}
                type="number"
                min="0"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
              />
              {fieldErrors.protein && <p className={styles.fieldError}>{fieldErrors.protein}</p>}
            </li>
          </ul>
        </div>
        <StepsSection
          steps={steps}
          setSteps={setSteps}
          error={fieldErrors.steps}
          disabled={saving}
        />
      </div>

      <button type="submit" className={styles.saveButton} disabled={saving}>
        {saving && <span className={styles.spinner} aria-hidden="true" />}
        {saving ? "Zapisywanie..." : "Zapisz zmiany"}
      </button>
    </form>
  );
}
