import { redirect } from "next/navigation";

// The works list is a view of the home page now.
export default function IndexWorksPage() {
  redirect("/?view=works");
}
