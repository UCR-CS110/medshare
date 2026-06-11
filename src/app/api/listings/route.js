import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import Review from "@/models/Review";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";


export async function GET(req) {
 try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const verified = searchParams.get("verified");
    const providerType = searchParams.get("providerType");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 6;
    const skip = (page - 1) * limit;

    console.log("Search params:", { query, minPrice, maxPrice });

    const filter = {};
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ];
    }
    if (minPrice) {
      filter.dailyRate = { ...filter.dailyRate, $gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      filter.dailyRate = { ...filter.dailyRate, $lte: parseFloat(maxPrice) };
    }
    let sellerFilter = {};
    if (verified === "true") sellerFilter.isVerified = true;
    if (providerType) sellerFilter.providerType = providerType;

    if (Object.keys(sellerFilter).length > 0) {
      const User = (await import("@/models/User")).default;
      const matchingSellers = await User.find(sellerFilter).select("_id");
      filter.seller = { $in: matchingSellers.map(s => s._id) };
    }
  const total = await Listing.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  console.log("Filter:", JSON.stringify(filter));
  const listings = await Listing.find(filter)
      .populate("seller", "name")
      .skip(skip)
      .limit(limit);
  console.log("Results count:", listings.length);
  
  const listingsWithRatings = await Promise.all(
    listings.map(async (listing) => {
      const reviews = await Review.find({ listing: listing._id });
      const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;
      return { ...listing.toObject(), avgRating, reviewCount: reviews.length };
    })
  );
  return Response.json({ listings: listingsWithRatings, total, totalPages, page });
 } catch (error) {
  return Response.json({ error: error.message }, { status: 500 });
 }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const { title, description, dailyRate, location } = await req.json();

    const listing = await Listing.create({
      title,
      description,
      dailyRate,
      location,
      seller: user._id,
    });

    return Response.json(listing, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}