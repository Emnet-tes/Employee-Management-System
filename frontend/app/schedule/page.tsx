// app/schedule/page.tsx
import { auth } from "@/lib/auth";
import ClientSchedulePage from "./ClientSchedulePage";

export default async function Page() {
  const session = await auth(); 
  return <ClientSchedulePage  session={session as { user: { employeeId: string , role:string} }} />;
}
