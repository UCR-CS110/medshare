import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import Review from "@/models/Review";

export async function GET(req) {
 try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const verified = searchParams.get("verified");
    const providerType = searchParams.get("providerType");

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
  console.log("Filter:", JSON.stringify(filter));
  const listings = await Listing.find(filter).populate("seller", "name");
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
  return Response.json(listingsWithRatings);
 } catch (error) {
  return Response.json({ error: error.message }, { status: 500 });
 }
}