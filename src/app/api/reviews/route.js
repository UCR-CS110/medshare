import connectDB from "@/lib/db";
import Review from "@/models/Review";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const { listingId, rating, comment } = await req.json();

    const review = await Review.create({
      listing: listingId,
      reviewer: user._id,
      rating,
      comment,
    });

    return Response.json(review, { status: 201 });
  } catch (error) {
    console.error("Review error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId");
    const reviews = await Review.find({ listing: listingId }).populate("reviewer", "name");
    
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    return Response.json({ reviews, avgRating, count: reviews.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}