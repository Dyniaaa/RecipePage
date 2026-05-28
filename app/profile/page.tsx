import { getServerSession } from "next-auth";
import styles from "./page.module.scss";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession();

  const FirstLetter = (n: string) => n.slice(0, 1).toUpperCase();

  return (
    <div className={styles.profileMain}>
      <h1>Profile Page</h1>
      {!session?.user?.image ? (
        <div className={styles.avatarPlaceholder}>
          <span aria-hidden="true">
            {FirstLetter(session?.user?.name || "")}
          </span>
        </div>
      ) : (
        <Image
          src={session?.user?.image}
          alt="User Avatar"
          width={120}
          height={120}
          className={styles.avatar}
        />
      )}
      <h2>{session?.user?.name}</h2>
      <h2>{session?.user?.email}</h2>
    </div>
  );
}
