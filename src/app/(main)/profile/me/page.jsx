"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";


export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [requestedBookings, setRequestedBookings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const tabs = ["My Bookings", "My Listings", "Incoming Requests"];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    function fetchMyListings() {
        return fetch("/api/users/" + session.user.id + "/listings")
            .then((res) => res.json())
            .then((data) => setListings(data))
            .catch((error) => console.error("Error fetching listings:", error));
        }

    function fetchIncomingRequests() {
        return fetch("/api/bookings?scope=incoming")
            .then((res) => res.json())
            .then((data) => setRequestedBookings(data))
            .catch((error) => console.error("Error fetching incoming requests:", error));
    }

    function fetchMyBookings() {
        return fetch("/api/bookings")
            .then((res) => res.json())
            .then((data) => setBookings(data))
            .catch((error) => console.error("Error fetching bookings:", error));
    }

    async function fetchData() {
        setLoading(true);
        try {
            await Promise.all([fetchMyListings(), fetchIncomingRequests(), fetchMyBookings()]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function changeBookingStatus(bookingId, newStatus) {
        try {
            const res = await fetch("/api/bookings/" + bookingId, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                fetchData();
            } else {
                const data = await res.json();
                console.error("Error updating booking status:", data.error || "Unknown error");
            }
        } catch (error) {
            console.error("Error updating booking status:", error);
        }

        fetchData();
    } 
            

    useEffect(() => {
        if (status !== "authenticated") {
            if (status === "unauthenticated") {
                setLoading(false);
            }
            return;
        }

        fetchData();
    }, [session?.user?.id, status]);

    if (status === "loading" || loading) {
        return <div>Loading...</div>;
    }

    if (status === "unauthenticated") {
        return <div className="p-4">Please sign in to view your profile.</div>;
    }
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="flex space-x-4 mb-6">
                {tabs.map((tab) => (
                    <Button
                        key={tab}
                        variant={activeTab === tab ? "default" : "outline"}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </Button>
                ))}
            </div>

            {activeTab === "My Bookings" && (
                <div className="space-y-4">
                    {bookings.length === 0 ? (
                        <p>You have no active bookings.</p>
                    ) : (
                        bookings.map((booking) => (
                            <div key={booking._id} className="border border-gray-200 rounded-xl p-4 bg-white">
                                <h2 className="text-xl font-semibold">{booking.listing.title}</h2>
                                <p className="text-gray-600">Booked from: {booking.listing?.seller?.name ?? "Unknown provider"}</p>
                                <p className="text-gray-600">Status: {booking.status}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "My Listings" && (
                <div className="space-y-4">
                    {listings.length === 0 ? (
                        <p>You have no active listings.</p>
                    ) : (
                        listings.map((listing) => (
                            <div key={listing._id} className="border border-gray-200 rounded-xl p-4 bg-white">
                                <h2 className="text-xl font-semibold">{listing.title}</h2>
                                <p className="text-gray-600">{listing.description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "Incoming Requests" && (
                <div className="space-y-4">
                    {requestedBookings.length === 0 ? (
                        <p>You have no incoming booking requests.</p>
                    ) : (
                        requestedBookings.map((booking) => (
                            <div key={booking._id} className="border border-gray-200 rounded-xl p-4 bg-white">
                                <h2 className="text-xl font-semibold">{booking.listing.title}</h2>
                                <p className="text-gray-600">Requested by: {booking.renter?.name ?? "Unknown renter"}</p>
                                <p className="text-gray-600">Status: {booking.status}</p>
                                {booking.status === "pending" && (
                                    <div className="mt-4 space-x-2">
                                        <Button onClick={() => changeBookingStatus(booking._id, "confirmed")}>Approve</Button>
                                        <Button variant="outline" onClick={() => changeBookingStatus(booking._id, "cancelled")}>Reject</Button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
        
    );
}