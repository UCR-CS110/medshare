import mongoose from "mongoose";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Listing from "@/models/Listing";
import Booking from "@/models/Booking";
import Review from "@/models/Review";
import { requireAdminSession } from "@/lib/admin";

function invalidIdResponse() {
  return Response.json({ error: "Invalid user ID" }, { status: 400 });
}

export async function PATCH(request, { params }) {
  const admin = await requireAdminSession();
  if (admin.error) {
    return admin.error;
  }

  const { id } = await params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  if (id === admin.session.user.id) {
    return Response.json({ error: "You cannot modify your own admin role from this panel" }, { status: 400 });
  }

  const body = await request.json();
  const updates = {};

  if (body.role === "user" || body.role === "admin") {
    updates.role = body.role;
  }

  if (typeof body.isVerified === "boolean") {
    updates.isVerified = body.isVerified;
  }

  if (body.providerType === "medical-clinic" || body.providerType === "individual-caregiver" || body.providerType === "non-profit-center") {
    updates.providerType = body.providerType;
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "No valid fields provided" }, { status: 400 });
  }

  await connectDB();

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { ...updates, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(updatedUser);
}

export async function DELETE(_request, { params }) {
  const admin = await requireAdminSession();
  if (admin.error) {
    return admin.error;
  }

  const { id } = params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  if (id === admin.session.user.id) {
    return Response.json({ error: "You cannot delete your own admin account from this panel" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findById(id);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const listings = await Listing.find({ seller: id }).select("_id");
  const listingIds = listings.map((listing) => listing._id);

  await Promise.all([
    Review.deleteMany({ $or: [{ reviewer: id }, { listing: { $in: listingIds } }] }),
    Booking.deleteMany({ $or: [{ renter: id }, { listing: { $in: listingIds } }] }),
    Listing.deleteMany({ seller: id }),
    User.findByIdAndDelete(id),
  ]);

  return Response.json({ success: true });
}