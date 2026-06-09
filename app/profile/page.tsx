import { getServerSession } from "next-auth";
import styles from "./page.module.scss";
import ProfileForm from "./form";

export default async function ProfilePage() {
  const session = await getServerSession();

  return (
    <main className={styles.profileMain}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <ProfileForm session={session} />

          <aside className={styles.statsCard}>
            <h2>Statistics</h2>

            <div className={styles.statsList}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>🍳</div>

                <div>
                  <p>Recipes</p>
                  <span>0</span>
                </div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statIcon}>♡</div>

                <div>
                  <p>Total Likes</p>
                  <span>0</span>
                </div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statIcon}>💬</div>

                <div>
                  <p>Comments</p>
                  <span>0</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className={styles.recipesSection}>
          <h2>My Recipes</h2>

          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🍳</div>

            <p className={styles.emptyTitle}>No recipes yet</p>

            <p className={styles.emptySubtitle}>
              Start sharing your delicious recipes!
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
