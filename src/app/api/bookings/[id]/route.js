import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Listing from "@/models/Listing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Retrieve booking details
export async function GET(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const { id } = await params;
        await connectDB();

        const booking = await Booking.findById(id).populate("listing").populate("renter");

        if (!booking) {
            return new Response(JSON.stringify({ error: "Booking not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Ensure the authenticated user is either the renter or the owner of the listing
        if (booking.renter._id.toString() !== session.user.id && booking.listing.seller.toString() !== session.user.id) {
            return new Response(JSON.stringify({ error: "Forbidden" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(booking), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching booking:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}