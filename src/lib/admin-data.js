import User from "@/models/User";
import Listing from "@/models/Listing";
import Booking from "@/models/Booking";
import Review from "@/models/Review";

export async function getAdminOverviewData() {
  const [users, listings, bookings, reviews, userCount, listingCount, bookingCount, reviewCount] = await Promise.all([
    User.find()
      .select("name email role isVerified providerType createdAt avgRating")
      .sort({ createdAt: -1 })
      .lean(),
    Listing.find()
      .populate("seller", "name email role")
      .sort({ createdAt: -1 })
      .lean(),
    Booking.find()
      .populate({
        path: "listing",
        select: "title seller",
        populate: { path: "seller", select: "name email" },
      })
      .populate("renter", "name email role")
      .sort({ createdAt: -1 })
      .lean(),
    Review.find()
      .populate("listing", "title")
      .populate("reviewer", "name email role")
      .sort({ createdAt: -1 })
      .lean(),
    User.countDocuments(),
    Listing.countDocuments(),
    Booking.countDocuments(),
    Review.countDocuments(),
  ]);

  return {
    counts: {
      users: userCount,
      listings: listingCount,
      bookings: bookingCount,
      reviews: reviewCount,
    },
    users,
    listings,
    bookings,
    reviews,
  };
}