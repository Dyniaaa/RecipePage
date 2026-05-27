import Link from "next/link";
import styles from "./page.module.scss";

export default function AddRecipePage() {
  return (
    <main>
      <Link href="/">
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
        Powrót do strony głównej
      </Link>
    </main>
  );
}
