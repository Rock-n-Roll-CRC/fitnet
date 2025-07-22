import { redirect } from "next/navigation";

export default function Page() {
  redirect("/connections/friends");

  return null;
}
