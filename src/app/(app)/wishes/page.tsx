import { redirect } from "next/navigation";

export default function LegacyWishesPage() {
  redirect("/goals/wishes");
}
