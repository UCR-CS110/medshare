import mongoose from "mongoose";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid user ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await connectDB();

    const user = await User.findById(id).select("-password").populate({
      path: "listings",
      populate: { path: "reviews" }
    });

    const userData = user ? user.toObject() : null;
    userData.listings = userData.listings || [];
    userData.listings.forEach((listing) => {
      listing.reviews = listing.reviews || [];
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(userData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Check if the user is authenticated before allowing updates
export async function PATCH(request, { params }) {
  const { id } = await params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid user ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check that only the logged-in user can update their own profile
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!session || userId !== id) {
    console.log("Session:", session);
    console.log("Unauthorized update attempt by user:", userId, "on user ID:", id);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await connectDB();

    const data = await request.json();
    const { name, email, bio, providerType } = data;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, bio, providerType, updatedAt: Date.now() },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}