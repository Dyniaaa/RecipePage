import Link from "next/link";
import styles from "./recipesMap.module.scss";

export default function RecipesMap({ recipes }: { recipes: any[] }) {
  console.log(recipes);

  return (
    <ul className={styles.grid}>
      {recipes.map((recipe) => (
        <li key={recipe.id} className={styles.card}>
          <Link href={recipe.title}>
            <div className={styles.imageWrapper}>
              <img
                src={recipe.image || "/placeholder.jpg"}
                alt={recipe.title}
                className={styles.image}
              />

              <button className={styles.heartBtn}>♡</button>
            </div>

            <div className={styles.content}>
              <h2 className={styles.title}>{recipe.title}</h2>
              <p className={styles.description}>{recipe.description}</p>

              <div className={styles.meta}>
                <span>⏱ {recipe.time ?? 0} min</span>
                <span>🍽 {recipe.servings ?? 0} servings</span>
              </div>

              <div className={styles.calories}>
                {recipe.calories && recipe.servings
                  ? recipe.calories / recipe.servings
                  : 0}{" "}
                cal per serving
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
