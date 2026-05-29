import styles from "./recipesMap.module.scss";

export default function RecipesMap({ recipes }: { recipes: any[] }) {
  return (
    <ul className={styles.grid}>
      {recipes.map((recipe) => (
        <li key={recipe.id} className={styles.card}>
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
              <span>⏱ {recipe.prepTime ?? 0} min</span>
              <span>🍽 {recipe.servings ?? 0} servings</span>
            </div>

            <div className={styles.calories}>{recipe.calories ?? 0} cal</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
