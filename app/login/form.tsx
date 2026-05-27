"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";
import styles from "./form.module.scss";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function LoginForm() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    console.log({ res });
    if (!res?.error) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <Image
        loading="eager"
        className={styles.logo}
        src={logo}
        alt="logo"
        height={160}
        width={160}
      />
      <h3 className={styles.title}>Welcome Back!</h3>
      <p className={styles.subtitle}>
        Sign in to continue your culinary journey!
      </p>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          name="email"
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          className={styles.input}
          type="password"
          placeholder="Enter your password"
          name="password"
        />
      </div>

      <button className={styles.submitButton} type="submit">
        Sign In
      </button>
      <p className={styles.footerText}>
        Don't have an account?{" "}
        <a className={styles.link} href="/register">
          Register
        </a>
      </p>
    </form>
  );
}
