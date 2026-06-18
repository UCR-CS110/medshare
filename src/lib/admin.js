import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { session: null, error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (session.user.role === "admin") {
    return { session, error: null };
  }

  await connectDB();

  const user = await User.findById(session.user.id).select("role");
  if (user?.role === "admin") {
    return {
      session: {
        ...session,
        user: {
          ...session.user,
          role: "admin",
        },
      },
      error: null,
    };
  }

  return { session: null, error: Response.json({ error: "Forbidden" }, { status: 403 }) };
}