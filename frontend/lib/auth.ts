import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
 

export function auth() {
  return getServerSession(authOptions);
}
