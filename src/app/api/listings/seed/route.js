import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const user = await User.findOne({ email: session.user.email });
  console.log("session email:", session.user.email);
  console.log("found user:", user);
  if (!user) return Response.json({ error: "User not found in DB" }, { status: 404 });

  const listings = await Listing.insertMany([
    { title: "Standard Foldable Wheelchair", description: "Lightweight wheelchair for home use.", dailyRate: 12, location: "Central Medical Hub", seller: user._id },
    { title: "Adjustable 4-Wheel Walker", description: "Sturdy walker with adjustable height.", dailyRate: 8, location: "Westside Clinic", seller: user._id },
    { title: "Forearm Crutches", description: "Lightweight aluminum crutches.", dailyRate: 5, location: "Downtown Medical", seller: user._id },
    { title: "Ultra-Light Transport Chair", description: "Compact transport chair.", dailyRate: 10, location: "Eastside Hospital", seller: user._id },
    { title: "Stability Quad Cane", description: "Four-point base cane for stability.", dailyRate: 3, location: "Northside Pharmacy", seller: user._id },
    { title: "Manual Hospital Bed", description: "Adjustable hospital bed with side rails.", dailyRate: 35, location: "Central Medical Hub", seller: user._id },
]);

  return Response.json(listings);
}