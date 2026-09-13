"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./form.module.scss";
import Image from "next/image";
import logo from "@/public/logo.png";
import { validateEmail, validateRequired, type FieldErrors } from "@/lib/validation";

export default function RegisterForm() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("userName") || "").trim();
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const nextFieldErrors: FieldErrors = {
      name: validateRequired(name, "Imię"),
      email: validateEmail(email),
      password: "",
      confirmPassword: "",
    };

    if (name.length > 0 && name.length < 2) {
      nextFieldErrors.name = "Imię musi mieć co najmniej 2 znaki.";
    }
    if (password.length < 8) {
      nextFieldErrors.password = "Hasło musi mieć co najmniej 8 znaków.";
    } else if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
      nextFieldErrors.password = "Hasło musi zawierać wielką literę i cyfrę.";
    }
    if (password !== confirmPassword) {
      nextFieldErrors.confirmPassword = "Hasła nie są takie same.";
    }

    setFieldErrors(nextFieldErrors);
    if (Object.values(nextFieldErrors).some(Boolean)) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Nie udało się utworzyć konta.");
        setLoading(false);
        return;
      }

      setSuccess(
        "Konto zostało utworzone! Sprawdź swoją skrzynkę e-mail i potwierdź konto.",
      );

      setLoading(false);

      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (error) {
      console.error("Błąd rejestracji:", error);

      setError("Wystąpił problem. Spróbuj ponownie później.");

      setLoading(false);
    }
  };

  return (
    <form className={styles.registerForm} onSubmit={handleSubmit}>
      <Image
        loading="eager"
        className={styles.logo}
        src={logo}
        alt="logo"
        height={160}
        width={160}
      />

      <h3 className={styles.title}>Create Account</h3>

      <p className={styles.subtitle}>Join our recipe community today!</p>

      {error && <p className={styles.error} role="alert">{error}</p>}

      {success && <p className={styles.success}>✓ {success}</p>}

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="userName">
          Name
        </label>

        <input
          className={`${styles.input} ${fieldErrors.name ? styles.inputError : ""}`}
          id="userName"
          type="text"
          placeholder="Name"
          name="userName"
          required
        />
        {fieldErrors.name && <p className={styles.fieldError}>{fieldErrors.name}</p>}
      </div>

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
          required
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
          placeholder="At least 6 characters"
          name="password"
          required
        />
        {fieldErrors.password && <p className={styles.fieldError}>{fieldErrors.password}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="confirmPassword">
          Confirm Password
        </label>

        <input
          className={`${styles.input} ${fieldErrors.confirmPassword ? styles.inputError : ""}`}
          id="confirmPassword"
          type="password"
          placeholder="Confirm your Password"
          name="confirmPassword"
          required
        />
        {fieldErrors.confirmPassword && <p className={styles.fieldError}>{fieldErrors.confirmPassword}</p>}
      </div>

      <button className={styles.submitButton} type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </button>

      <p className={styles.footerText}>
        Already have an account?{" "}
        <a className={styles.link} href="/login">
          Login
        </a>
      </p>
    </form>
  );
}
