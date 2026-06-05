import NextAuth from "next-auth"
import bcrypt from "bcryptjs"
import GoogleProvider from "next-auth/providers/google"
import connectDB from "@/lib/db"
import CredentialsProvider from "next-auth/providers/credentials"
import User from "@/models/User"

export const authOptions = ({
  secret: process.env.BETTER_AUTH_SECRET,
  pages: [
    {
      signIn: "/login",
      error: "/login?error=1"
    },
  ],
  session: {
    strategy: "jwt",
  },
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials.email && credentials.password) {
          await connectDB();

          const user = await User.findOne({ email: credentials.email }).select("+password");
          if (!user) {
            console.log("User not found with email:", credentials.email);
            throw new Error("User not found");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.log("Invalid password for email:", credentials.email);
            throw new Error("Invalid password");
          }

          console.log("User authenticated:", user.email);
          return { id: user._id, name: user.name, email: user.email };
        }
        throw new Error("Invalid credentials");
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  }
})

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }