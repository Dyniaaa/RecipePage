"use client";

import Image from "next/image";
import styles from "./form.module.scss";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { validateEmail, validateRequired, type FieldErrors } from "@/lib/validation";

export default function ProfileForm() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [edit, setEdit] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const FirstLetter = (n: string) => n.slice(0, 1).toUpperCase();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFieldErrors((current) => ({ ...current, image: "Wybierz plik graficzny." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((current) => ({
        ...current,
        image: "Zdjęcie może mieć maksymalnie 5 MB.",
      }));
      return;
    }
    setFieldErrors((current) => ({ ...current, image: "" }));

    const img = document.createElement("img");

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 150;

      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const cropSize = Math.min(img.width, img.height);

      const sx = (img.width - cropSize) / 2;
      const sy = (img.height - cropSize) / 2;
      ctx.drawImage(img, sx, sy, cropSize, cropSize, 0, 0, size, size);

      const compressedImage = canvas.toDataURL("image/jpeg", 0.7);

      console.log("imageSize:", compressedImage.length);

      setImagePreview(compressedImage);
      setImageBase64(compressedImage);

      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "");
      const nextFieldErrors: FieldErrors = {
        name: validateRequired(name, "Imię"),
        email: validateEmail(email),
        image: fieldErrors.image || "",
      };

      if (name.length > 0 && name.length < 2) {
        nextFieldErrors.name = "Imię musi mieć co najmniej 2 znaki.";
      }
      setFieldErrors(nextFieldErrors);
      if (Object.values(nextFieldErrors).some(Boolean)) return;

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: session?.user?.id,
          name,
          email,
          image: imageBase64,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Nie udało się zapisać zmian profilu.");
        return;
      }

      await update({
        name: data.name,
        email: data.email,
        image: data.image,
      });

      setEdit(true);
      router.refresh();
    } catch (error) {
      console.error("Błąd aktualizacji profilu:", error);
      setError("Wystąpił problem z połączeniem. Spróbuj ponownie.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.profileCard}>
      <div className={styles.cardHeader}>
        <h2>My Profile</h2>

        <button
          type="button"
          className={styles.editButton}
          onClick={() => setEdit((prev) => !prev)}
        >
          ✎ Edit Profile
        </button>
      </div>

      {edit ? (
        <div className={styles.profileContent}>
          <div className={styles.avatar}>
            {!session?.user?.image ? (
              <div className={styles.avatarPlaceholder}>
                <span aria-hidden="true">
                  {FirstLetter(session?.user?.name || "")}
                </span>
              </div>
            ) : (
              <Image
                src={session.user.image}
                alt="User Avatar"
                className={styles.avatarImage}
                width={160}
                height={160}
                unoptimized
              />
            )}
          </div>

          <div className={styles.userInfo}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Name</span>
              <span className={styles.value}>{session?.user?.name}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{session?.user?.email}</span>
            </div>
          </div>
        </div>
      ) : (
        <form className={styles.editForm} onSubmit={handleSubmit}>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <label className={styles.label} htmlFor="recipeImage">
            Zdjęcie Przepisu
          </label>
          <input
            className={styles.input}
            type="file"
            id="recipeImage"
            name="recipeImage"
            accept="image/*"
            onChange={handleImageChange}
          />
          {fieldErrors.image && <p className={styles.fieldError}>{fieldErrors.image}</p>}
          {imagePreview && (
            <div className={styles.imagePreview}>
              <Image
                src={imagePreview}
                alt="Preview"
                width={640}
                height={480}
                unoptimized
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              className={fieldErrors.name ? styles.inputError : ""}
              type="text"
              id="name"
              name="name"
              defaultValue={session?.user?.name || ""}
            />
            {fieldErrors.name && <p className={styles.fieldError}>{fieldErrors.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              className={fieldErrors.email ? styles.inputError : ""}
              type="email"
              id="email"
              name="email"
              defaultValue={session?.user?.email || ""}
            />
            {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </section>
  );
}
