"use client";

import { useEffect } from "react";
import styles from "./error.module.scss";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Błąd aplikacji:", error);
  }, [error]);

  return (
    <main className={styles.page}>
      <section className={styles.card} role="alert">
        <span className={styles.icon} aria-hidden="true">
          !
        </span>
        <h1>Coś poszło nie tak</h1>
        <p>Nie udało się wczytać tej strony. Spróbuj ponownie.</p>
        <button type="button" onClick={() => reset()}>
          Spróbuj ponownie
        </button>
      </section>
    </main>
  );
}
