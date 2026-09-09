"use client";

import Image from "next/image";
import styles from "./form.module.scss";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileForm() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [edit, setEdit] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const FirstLetter = (n: string) => n.slice(0, 1).toUpperCase();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const img = document.createElement("img");

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const size = 150;

      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(img, 0, 0, size, size);

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

    const formData = new FormData(e.currentTarget);

    console.log("imageSize:", imageBase64?.length);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session?.user?.id,
        name: formData.get("name"),
        email: formData.get("email"),
        image: imageBase64,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      return;
    }

    await update({
      name: data.name,
      email: data.email,
      image: data.image,
    });

    setEdit(true);
    router.refresh();
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
                width={120}
                height={120}
                className={styles.avatarImage}
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
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={session?.user?.name || ""}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={session?.user?.email || ""}
            />
          </div>

          <button type="submit">Save Changes</button>
        </form>
      )}
    </section>
  );
}
