import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { isVerified: true, providerType: 'individual-caregiver' },
    { new: true }
  );

  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  return Response.json({ 
    message: "User updated", 
    isVerified: user.isVerified, 
    providerType: user.providerType 
  });
}