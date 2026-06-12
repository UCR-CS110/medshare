import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import { requireAdminSession } from "@/lib/admin";

export async function DELETE(_request, { params }) {
  const admin = await requireAdminSession();
  if (admin.error) {
    return admin.error;
  }

  const { id } = await params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid review ID" }, { status: 400 });
  }

  await connectDB();

  const deletedReview = await Review.findByIdAndDelete(id);
  if (!deletedReview) {
    return Response.json({ error: "Review not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}