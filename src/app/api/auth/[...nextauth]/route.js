import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  // Test secret, replace with env variable in production
  secret: "test_secret",
  pages: [
    { signIn: "/login" },
  ],
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
          // User validation logic (TODO)
          return { data: { id: "1", email: credentials.email }, error: null };
        }
        return { data: null, error: "Invalid credentials" };
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  }
})

export { handler as GET, handler as POST }