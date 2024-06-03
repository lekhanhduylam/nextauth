import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { readUsersFromFile, writeUsersToFile } from "./file-utils";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        console.log({ email, password });
        if (!email || !password) {
          throw new Error("Email and password are required");
        }
        const users = await readUsersFromFile();

        const user = users.find(
          (item) =>
            item.email?.toLowerCase() === credentials?.email?.toLowerCase() &&
            item.password?.toString() === credentials?.password?.toString()
        );
        console.log("users", users);
        console.log("user", user);
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      if (token) {
        session.user = {
          email: token.email,
          name: token.name,
          image: token.picture,
        };
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log({
        user,
        account,
        profile,
      });
      const users = await readUsersFromFile();
      const existingUser = users.find((u) => u.id === user.id);
      if (!existingUser) {
        users.push({
          id: user.id,
          email: user.email!,
          name: user.name!,
          image: user.image!,
        });
        await writeUsersToFile(users);
        console.log("Updated Users", users);
      }
      return true;
    },
  },
};
