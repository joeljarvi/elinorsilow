import { redirect } from "next/navigation";

// The index lives on the home page now.
export default function IndexPage() {
  redirect("/");
}
