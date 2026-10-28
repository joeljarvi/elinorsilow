import { redirect } from "next/navigation";

// The exhibitions list is a view of the home page now.
export default function IndexExhibitionsPage() {
  redirect("/?view=exhibitions");
}
