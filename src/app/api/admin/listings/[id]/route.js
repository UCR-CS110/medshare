import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import Booking from "@/models/Booking";
import Review from "@/models/Review";
import { requireAdminSession } from "@/lib/admin";

export async function DELETE(_request, { params }) {
  const admin = await requireAdminSession();
  if (admin.error) {
    return admin.error;
  }

  const { id } = await params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid listing ID" }, { status: 400 });
  }

  await connectDB();

  await Promise.all([
    Booking.deleteMany({ listing: id }),
    Review.deleteMany({ listing: id }),
  ]);

  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    return Response.json({ error: "Listing not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}