import styles from "./page.module.scss";
import ProfileForm from "./form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getRecipeByAuthor } from "@/lib/recipe";
import { redirect } from "next/navigation";
import ProfileRecipes from "@/components/profileRecipes";
import { getUserFavorites } from "@/lib/favorite";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const recipes = await getRecipeByAuthor(userId);
  const favoriteRecipes = await getUserFavorites(userId);

  return (
    <main className={styles.profileMain}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <ProfileForm />

          <aside className={styles.statsCard}>
            <h2>Statystyki</h2>

            <div className={styles.statsList}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>🍳</div>

                <div>
                  <p>Przepisy</p>
                  <span>{recipes.length}</span>
                </div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statIcon}>♡</div>

                <div>
                  <p>Ulubione</p>
                  <span>{favoriteRecipes.length}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <ProfileRecipes recipes={recipes} favoriteRecipes={favoriteRecipes} />
      </div>
    </main>
  );
}
