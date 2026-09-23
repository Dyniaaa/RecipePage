import Link from "next/link";
import Image from "next/image";
import styles from "./recipesMap.module.scss";
import type { RecipeCard } from "@/types/recipe";

export default function RecipesMap({ recipes }: { recipes: RecipeCard[] }) {
  return (
    <ul className={styles.grid}>
      {recipes.map((recipe) => (
        <li key={recipe.id} className={styles.card}>
          <Link href={recipe.id}>
            <div className={styles.imageWrapper}>
              <Image
                src={recipe.image || "/placeholder.jpg"}
                alt={recipe.title}
                className={styles.image}
                width={640}
                height={480}
                unoptimized
              />
            </div>

            <div className={styles.content}>
              <h2 className={styles.title}>{recipe.title}</h2>
              <p className={styles.description}>
                {recipe.description
                  ? recipe.description.length > 100
                    ? `${recipe.description.slice(0, 100).trimEnd()}...`
                    : recipe.description
                  : ""}
              </p>

              <div className={styles.meta}>
                <span>⏱ {recipe.time ?? 0} min</span>
                <span>🍽 {recipe.servings ?? 0} servings</span>
              </div>

              <div className={styles.calories}>
                {recipe.calories && recipe.servings
                  ? (recipe.calories / recipe.servings).toFixed(1)
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
