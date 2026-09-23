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
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <div className={styles.logoWrapper}>
            <Image src={logo} alt="HappyAvocado" fill sizes="48px" />
          </div>
          <span className={styles.title}>HappyAvocado</span>
        </Link>

        <div className={styles.actions}>
          <Link href="/profile" className={styles.user}>
            {session?.user?.image ? (
              <img
                className={styles.userAvatar}
                src={session.user.image}
                alt=""
              />
            ) : (
              <span className={styles.userAvatarFallback} aria-hidden="true">
                {userName.trim().charAt(0).toUpperCase() || "?"}
              </span>
            )}
            {formatNick(userName)}
          </Link>

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

          <Link href="/calendar" className={styles.button}>
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
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Calendar
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
      </div>
    </header>
  );
}
