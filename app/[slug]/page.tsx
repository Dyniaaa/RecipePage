import { getRecipeById } from "@/lib/recipe";
import styles from "./page.module.scss";
import { notFound } from "next/navigation";
import SlugDetails from "@/components/slugDetails/SlugDetails";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const recipe = await getRecipeById(slug);

  if (!recipe) {
    return notFound();
  }
  return (
    <section className={styles.container}>
      <SlugDetails recipe={recipe} />
    </section>
  );
}
