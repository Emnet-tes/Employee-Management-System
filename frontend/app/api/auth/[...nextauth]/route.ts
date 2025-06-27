

import NextAuth from "next-auth";
import { authOptions } from "./options";

// Extend the built-in types to include `id` and `role`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      employeeId?: string | null;
    };
  }

  interface User {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}



// Required to handle auth routes in /api/auth/[...nextauth].ts
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
