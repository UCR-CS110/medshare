import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Listing from "@/models/Listing";


// Retrieve all listings made by a specific user
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

    const listings = await Listing.find({ seller: id }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(listings), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user's listings:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}