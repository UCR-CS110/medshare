import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Review from "@/models/Review";
import { requireAdminSession } from "@/lib/admin";

export async function PATCH(request, { params }) {
  const admin = await requireAdminSession();
  if (admin.error) {
    return admin.error;
  }

  const { id } = await params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid booking ID" }, { status: 400 });
  }

  const { status } = await request.json();
  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return Response.json({ error: "Invalid status value" }, { status: 400 });
  }

  await connectDB();

  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { status, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!updatedBooking) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  return Response.json(updatedBooking);
}

export async function DELETE(_request, { params }) {
  const admin = await requireAdminSession();
  if (admin.error) {
    return admin.error;
  }

  const { id } = params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid booking ID" }, { status: 400 });
  }

  await connectDB();

  await Review.deleteMany({ booking: id });

  const deletedBooking = await Booking.findByIdAndDelete(id);
  if (!deletedBooking) {
    return Response.json({ error: "Booking not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}