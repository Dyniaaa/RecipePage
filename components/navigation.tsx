"use client";

import type { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import styles from "./navigation.module.scss";
import logo from "@/public/logo.png";

export default function Navigation({ session }: { session: Session | null }) {
  const userName = session?.user?.name || "Guest";
  const formatNick = (n: string) =>
    n ? n[0].toUpperCase() + n.slice(1).toLowerCase() : "";

  return (
    <header className={styles.navigation}>
      <Link href="/" className={styles.brand}>
        <div className={styles.logoWrapper}>
          <Image src={logo} alt="HappyAvocado" fill sizes="48px" />
        </div>
        <span className={styles.title}>HappyAvocado</span>
      </Link>

      <div className={styles.actions}>
        <a href="/profile" className={styles.user}>
          <span className={styles.userIcon} aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </span>
          {formatNick(userName)}
        </a>

        <Link href="/addRecipe" className={styles.button}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Recipe
        </Link>

        <button
          type="button"
          className={styles.logout}
          onClick={() => signOut()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}
