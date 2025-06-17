import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "@/lib/sanity/client";
import bcrypt from "bcryptjs";

// Extend the built-in types to include `id` and `role`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
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

// Exported so you can use it in getServerSession()
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Look for user in Sanity
        const user = await client.fetch(
          `*[_type == "user" && email == $email][0]{
            _id,
            email,
            password,
            role->{
              _id,
              title
            }
          }`,
          { email: credentials.email }
        );

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          return null;
        }

        return {
          id: user._id,
          email: user.email,
          role: user.role?.title || "Employee", // fallback to Employee
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Required to handle auth routes in /api/auth/[...nextauth].ts
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
