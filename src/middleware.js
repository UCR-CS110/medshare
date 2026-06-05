import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Routes that require authentication
  matcher: [
    "/profile/:path*",
  ],
};