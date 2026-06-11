import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Get all bookings for the authenticated user
export async function GET(request, { params }) {
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
        const bookings = await Booking.find({ renter: userId }).populate("listing");

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

        const newBooking = new Booking({
            listing: mongoose.Types.ObjectId(listingId),
            renter: mongoose.Types.ObjectId(session.user.id),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
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