import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Get all bookings for the authenticated user
export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        await connectDB();

        const userId = session.user.id;
        const url = new URL(request.url);
        const scope = url.searchParams.get("scope");

        if (scope === "incoming") {
            const ownedListings = await Listing.find({ seller: userId }).select("_id");
            const listingIds = ownedListings.map((listing) => listing._id);
            const bookings = await Booking.find({ listing: { $in: listingIds } })
                .populate("listing")
                .populate("renter")
                .sort({ createdAt: -1 });

            return new Response(JSON.stringify(bookings), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        const bookings = await Booking.find({ renter: userId })
            .populate({
                path: "listing",
                populate: { path: "seller", select: "name bio" },
            })
            .sort({ createdAt: -1 });

        return new Response(JSON.stringify(bookings), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// Create a new booking for the authenticated user passing in the item ID in the request body
export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        await connectDB();

        const data = await request.json();
        const { listingId, startDate, endDate } = data;

        // Validate that the session user.id is a valid ObjectId and points to an existing user
        if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
            return new Response(JSON.stringify({ error: "Invalid user ID in session" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!listingId || !startDate || !endDate) {
            return new Response(JSON.stringify({ error: "listingId, startDate, and endDate are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            return new Response(JSON.stringify({ error: "Invalid listingId" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return new Response(JSON.stringify({ error: "Listing not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const parsedStart = new Date(startDate);
        const parsedEnd = new Date(endDate);

        if (Number.isNaN(parsedStart.getTime()) || Number.isNaN(parsedEnd.getTime())) {
            return new Response(JSON.stringify({ error: "Invalid startDate or endDate" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (parsedEnd <= parsedStart) {
            return new Response(JSON.stringify({ error: "endDate must be after startDate" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const totalDays = Math.max(1, Math.ceil((parsedEnd - parsedStart) / (1000 * 60 * 60 * 24)));

        const newBooking = new Booking({
            listing: listing._id,
            renter: session.user.id,
            startDate: parsedStart,
            endDate: parsedEnd,
            totalPrice: totalDays * listing.dailyRate,
            status: "pending",
        });

        await newBooking.save();

        return new Response(JSON.stringify(newBooking), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}