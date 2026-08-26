"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import styles from "./form.module.scss";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function RegisterForm() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("userName"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Registration failed");
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
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="userName">
          Name
        </label>
        <input
          className={styles.input}
          type="text"
          placeholder="Name"
          name="userName"
        />
      </div>
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
          placeholder="At least 6 characters"
          name="password"
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          className={styles.input}
          type="password"
          placeholder="Confirm your Password"
          name="confirmPassword"
        />
      </div>
      <button className={styles.submitButton} type="submit">
        Create Account
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
