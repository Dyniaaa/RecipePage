export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/addRecipe", "/profile", "/"],
};
