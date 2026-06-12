"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardAction, CardContent, CardFooter, CardDescription } from "@/components/ui/card";


export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [requestedBookings, setRequestedBookings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [listings, setListings] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
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

    function fetchUserInfo() {
        return fetch("/api/users/" + session.user.id)
            .then((res) => res.json())
            .then((data) => {
                setUserInfo(data);
            })
            .catch((error) => console.error("Error fetching user info:", error));
    }

    async function fetchData() {
        setLoading(true);
        try {
            await Promise.all([fetchMyListings(), fetchIncomingRequests(), fetchMyBookings(), fetchUserInfo()]);
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
            {/* Display user information */ }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>{userInfo?.name || session.user.name}</CardTitle>
                    <CardDescription>{userInfo?.email || session.user.email}</CardDescription>
                    <CardDescription>{userInfo?.bio || session.user.bio}</CardDescription>
                </CardHeader>
            </Card>

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
                            <Card key={booking._id} className="border-gray-200">
                                <CardHeader>
                                    <CardTitle>{booking.listing.title}</CardTitle>
                                    <CardDescription>Booked from: {booking.listing.seller?.name ?? "Unknown seller"}</CardDescription>
                                    <p className="text-gray-600">Status: {booking.status}</p>
                                </CardHeader>
                            </Card>
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
                            <Card key={listing._id} className="border-gray-200">
                                <CardHeader>
                                    <CardTitle>{listing.title}</CardTitle>
                                    <CardDescription>{listing.description}</CardDescription>
                                </CardHeader>
                            </Card>
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
                            <Card key={booking._id} className="border-gray-200">
                                <CardHeader>
                                    <CardTitle>{booking.listing.title}</CardTitle>
                                    <CardDescription>Requested from: {booking.renter?.name ?? "Unknown renter"}</CardDescription>
                                    <CardDescription>Status: {booking.status}</CardDescription>
                                    <CardAction className="flex space-x-2">
                                        {booking.status === "pending" && (
                                            <>
                                                <Button variant="outline" onClick={() => changeBookingStatus(booking._id, "approved")}>
                                                    Approve
                                                </Button>
                                                <Button variant="destructive" onClick={() => changeBookingStatus(booking._id, "cancelled")}>
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </CardAction>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">{booking.listing.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <p className="text-sm text-gray-500">
                                        Booking from {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
                                    </p>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
        
    );
}