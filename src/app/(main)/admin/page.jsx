import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AdminPanel from "@/components/admin-panel";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAdminOverviewData } from "@/lib/admin-data";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  await connectDB();
  const currentUser = await User.findById(session.user.id).select("role");

  if (currentUser?.role !== "admin") {
    redirect("/");
  }

  const initialOverview = await getAdminOverviewData();
  const plainInitialOverview = JSON.parse(JSON.stringify(initialOverview));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
      <AdminPanel initialOverview={plainInitialOverview} />
    </div>
  );
}