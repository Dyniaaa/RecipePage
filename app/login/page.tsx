import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./form";
import styles from "./page.module.scss";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className={styles.loginMain}>
      <LoginForm />
    </main>
  );
}
