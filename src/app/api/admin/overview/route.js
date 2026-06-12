import connectDB from "@/lib/db";
import { requireAdminSession } from "@/lib/admin";
import { getAdminOverviewData } from "@/lib/admin-data";

export async function GET() {
  const admin = await requireAdminSession();
  if (admin.error) {
    return admin.error;
  }

  await connectDB();

  return Response.json(await getAdminOverviewData());
}