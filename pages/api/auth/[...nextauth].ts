import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log({ credentials });
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isPasswordValid) {
          return null;
        }
        console.log({
          id: user.id,
          name: user.name,
          email: user.email,
        });
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      console.log({ token });
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          id: token.id as string,
          name: token.name,
          email: token.email,
        };
      }
      console.log({ session });
      return session;
    },
  },
});
