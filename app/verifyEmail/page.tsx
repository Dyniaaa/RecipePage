import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import styles from "./page.module.scss";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;

  console.log("TOKEN Z URL:", token);

  if (!token) {
    return (
      <main className={styles.errorPage}>
        <div className={styles.errorCard}>
        <h1>Nieprawidłowy link</h1>
        <p>Brakuje tokenu weryfikacyjnego.</p>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      verificationToken: token,
    },
  });

  if (!user) {
    return (
      <main className={styles.errorPage}>
        <div className={styles.errorCard}>
        <h1>Nieprawidłowy link</h1>
        <p>Link weryfikacyjny jest nieprawidłowy.</p>
        </div>
      </main>
    );
  }

  if (!user.verificationExpiry || user.verificationExpiry < new Date()) {
    return (
      <main className={styles.errorPage}>
        <div className={styles.errorCard}>
        <h1>Link wygasł</h1>
        <p>Link weryfikacyjny wygasł. Poproś o wysłanie nowego.</p>
        </div>
      </main>
    );
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
      verificationExpiry: null,
    },
  });

  redirect("/login?verified=true");
}
