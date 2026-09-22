"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";
import Link from "next/link";
import styles from "./form.module.scss";
import Image from "next/image";
import logo from "@/public/logo.png";
import { validateEmail, validatePassword, type FieldErrors } from "@/lib/validation";

export default function LoginForm() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const nextFieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setFieldErrors(nextFieldErrors);
    if (Object.values(nextFieldErrors).some(Boolean)) return;

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error.includes("EMAIL_NOT_VERIFIED")) {
          setError("Twój adres e-mail nie został jeszcze potwierdzony.");
        } else {
          setError("Nieprawidłowy email lub hasło.");
        }

        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Błąd logowania:", error);
      setError("Wystąpił problem z połączeniem. Spróbuj ponownie.");
    } finally {
      setLoading(false);
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

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>

        <input
          className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
          id="email"
          type="email"
          placeholder="Email"
          name="email"
          aria-invalid={Boolean(fieldErrors.email)}
        />
        {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>

        <input
          className={`${styles.input} ${fieldErrors.password ? styles.inputError : ""}`}
          id="password"
          type="password"
          placeholder="Enter your password"
          name="password"
          aria-invalid={Boolean(fieldErrors.password)}
        />
        {fieldErrors.password && <p className={styles.fieldError}>{fieldErrors.password}</p>}
      </div>

      <button className={styles.submitButton} type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className={styles.footerText}>
        Don&apos;t have an account?{" "}
        <Link className={styles.link} href="/register">
          Register
        </Link>
      </p>
    </form>
  );
}
