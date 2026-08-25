import { getRecipeByTitle } from "@/lib/recipe";
import styles from "./page.module.scss";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const recipe = await getRecipeByTitle(slug);
  console.log(recipe);

  if (!recipe) {
    return notFound();
  }
  return (
    <section className={styles.container}>
      <header>
        <Link className={styles.backLink} href="/">
          ← Back to Recipes
        </Link>
        <div>
          <button>Like</button>
          <button>Edit Recipe</button>
        </div>
      </header>

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
            <p className={styles.cardTitle}>Nutrition Facts</p>
            <ul className={styles.nutritionList}>
              <li>Kalorie: {recipe.calories ?? 0} kcal</li>
              <li>
                Kalorie na porcję:{" "}
                {recipe.calories
                  ? (recipe.calories / recipe.servings).toFixed(1)
                  : 0}{" "}
                kcal
              </li>
              <li>Białko: {recipe.protein ?? 0} g</li>
              <li>
                Białko na porcję:{" "}
                {recipe.protein
                  ? (recipe.protein / recipe.servings).toFixed(1)
                  : 0}{" "}
                g
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.instructions}>
          <p className={styles.sectionTitle}>Instructions</p>
          <ol className={styles.steps}>
            {recipe.steps.map((step) => (
              <li key={step.id}>{step.text}</li>
            ))}
          </ol>
        </div>
        <div className={styles.comments}>Comments</div>
      </div>
    </section>
  );
}
