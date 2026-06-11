import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import Review from "@/models/Review";

export async function GET(req) {
  await connectDB();
  const listings = await Listing.find({}).populate("seller", "name");
  
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
}