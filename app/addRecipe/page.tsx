import Link from "next/link";
import styles from "./page.module.scss";
import AddRecipeForm from "./form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AddRecipePage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <main className={styles.addRecipeMain}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Wróć do przepisów
        </Link>

        <h1 className={styles.title}>Dodaj Nowy Przepis</h1>

        <AddRecipeForm userEmail={session.user.email} />
      </div>
    </main>
  );
}
