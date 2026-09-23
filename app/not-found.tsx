import Link from "next/link";
import styles from "./error.module.scss";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.card} role="alert">
        <span className={styles.icon} aria-hidden="true">
          404
        </span>
        <h1>Nie znaleziono strony</h1>
        <p>Strona, której szukasz, nie istnieje albo została usunięta.</p>
        <Link className={styles.link} href="/">
          Wróć na stronę główną
        </Link>
      </section>
    </main>
  );
}