import { redirect } from "next/navigation";

// Info is a view of the home page now.
export default function InfoPage() {
  redirect("/?view=info");
}
