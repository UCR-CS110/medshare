import NextAuth from "next-auth"
import bcrypt from "bcryptjs"
import GoogleProvider from "next-auth/providers/google"
import connectDB from "@/lib/db"
import CredentialsProvider from "next-auth/providers/credentials"
import User from "@/models/User"

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login?error=1",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials.email && credentials.password) {
          await connectDB();
          const email = credentials.email.toLowerCase();

          const user = await User.findOne({ email }).select("+password");
          if (!user) {
            console.log("User not found with email:", email);
            throw new Error("User not found");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.log("Invalid password for email:", email);
            throw new Error("Invalid password");
          }

          console.log("User authenticated:", user.email);
          return { id: user._id, name: user.name, email: user.email, role: user.role };
        }
        throw new Error("Invalid credentials");
      },
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          await User.findOneAndUpdate(
            { email: user.email.toLowerCase() },
            {
              $setOnInsert: {
                name:  user.name,
                email: user.email.toLowerCase(),
                image: user.image ?? null,
              },
            },
            { upsert: true, new: true }
          );
        } catch (err) {
          console.error("signIn callback error:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.id;
        token.name = user.name ?? token.name;
        token.email = user.email?.toLowerCase() ?? token.email;
        token.role = user.role ?? token.role ?? "user";
      }

      if (token.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email.toLowerCase() }).select("_id name email role");

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.role = dbUser.role;
        }
      }

      token.role = token.role ?? "user";
      return token;
    },
    async session({ session, token }) {
        if (token) {
            session.user.id = token.id;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.role = token.role ?? "user";
        }
        return session;
    },
  }
}
