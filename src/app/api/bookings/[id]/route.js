import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Listing from "@/models/Listing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function error_response(message, status_code = 400) {
    return new Response(JSON.stringify({ error: message }), {
        status: status_code,
        headers: { "Content-Type": "application/json" },
    });
}

// Retrieve booking details
export async function GET(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return error_response("Unauthorized", 401);
    }

    try {
        const { id } = await params;
        await connectDB();

        const booking = await Booking.findById(id).populate("listing").populate("renter");

        if (!booking) {
            return error_response("Booking not found", 404);
        }

        // Ensure the authenticated user is either the renter or the owner of the listing
        if (booking.renter._id.toString() !== session.user.id && booking.listing.seller.toString() !== session.user.id) {
            return error_response("Forbidden", 403);
        }

        return new Response(JSON.stringify(booking), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching booking:", error);
        return error_response("Internal server error", 500);
    }
}

// Change status of a booking (e.g. cancel or approve)
export async function PATCH(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return error_response("Unauthorized", 401);
    }

    try {
        const { id } = await params;
        await connectDB();

        const booking = await Booking.findById(id).populate("listing");

        if (!booking) {
            return error_response("Booking not found", 404);
        }

        // Ensure the authenticated user is the owner of the listing
        if (booking.listing.seller.toString() !== session.user.id) {
            return error_response("Forbidden", 403);
        }

        const data = await request.json();
        const { status } = data;

        if (!["pending", "confirmed", "cancelled"].includes(status)) {
            return error_response("Invalid status value", 400);
        }

        booking.status = status;
        await booking.save();

        return new Response(JSON.stringify(booking), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating booking:", error);
        return error_response("Internal server error", 500);
    }
}