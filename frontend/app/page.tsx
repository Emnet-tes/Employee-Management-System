import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

export default async function Home() {
  console.log("Checking authentication...");

  // Wait for 1 second (1000ms) if needed
  // await delay(36000);

  const session = await auth();

  console.log("Session:", session);

  // await delay(36000);

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}

