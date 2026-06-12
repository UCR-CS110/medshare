"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardAction, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { BadgeCheck, Mail, UserRound, BriefcaseMedical, Star} from "lucide-react";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [requestedBookings, setRequestedBookings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [listings, setListings] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [providerLabel, setProviderLabel] = useState("");
    const tabs = ["My Bookings", "My Listings", "Incoming Requests"];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const router = useRouter();

    function updateBio(newBio) {
        return fetch("/api/users/" + session.user.id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ bio: newBio }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.error("Error updating bio:", data.error);
                } else {
                    setUserInfo((prev) => ({ ...prev, bio: newBio }));
                }
            })
            .catch((error) => console.error("Error updating bio:", error));
    }

    function updateProviderType(newType) {
        return fetch("/api/users/" + session.user.id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ providerType: newType }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    console.error("Error updating provider type:", data.error);
                } else {
                    setUserInfo((prev) => ({ ...prev, providerType: newType }));
                    setProviderLabel(
                        {
                            "medical-clinic": "Medical Clinic",
                            "individual-caregiver": "Individual Caregiver",
                            "non-profit-center": "Non-Profit Center",
                        }[newType] || "Provider"
                    );
                }
            })
            .catch((error) => console.error("Error updating provider type:", error));
    }

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
                setProviderLabel(
                    {
                        "medical-clinic": "Medical Clinic",
                        "individual-caregiver": "Individual Caregiver",
                        "non-profit-center": "Non-Profit Center",
                    }[data.providerType] || "Provider"
                );
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
        <div className="bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <CardTitle className="text-2xl">{userInfo.name}</CardTitle>
                                        {userInfo.isVerified ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                <BadgeCheck className="size-3.5" /> Verified
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                Unverified
                                            </span>
                                        )}
                                    </div>
                                    <CardDescription className="mt-1">
                                        {userInfo.email}
                                        <div>
                                            <p className="mt-1 text-sm leading-6 text-slate-700">{userInfo.bio || "No public bio has been added yet."}</p>
                                            <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                                                const newBio = prompt("Update your bio:", userInfo.bio);
                                                if (newBio !== null) {
                                                    updateBio(newBio);
                                                }
                                            }}>
                                                Update Bio
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2 text-sm text-slate-600">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                                                <BriefcaseMedical className="size-4" /> {providerLabel}
                                                <Button variant="outline" size="sm" className="ml-2" onClick={() => {
                                                    const newType = prompt("Update your provider type (medical-clinic, individual-caregiver, non-profit-center):", userInfo.providerType);
                                                    if (newType !== null) {
                                                        updateProviderType(newType);
                                                    }
                                                }}>
                                                    Update
                                                </Button>
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                                                <Star className="size-4 text-amber-500" /> {userInfo.avgRating ? userInfo.avgRating.toFixed(1) : "New"}
                                            </span>
                                        </div>
                                    </CardDescription>
                                </div>
                            </div>
                    </CardHeader>
                    <div className="max-w-4xl mx-auto p-4">
                        <div className="flex items-center justify-center space-x-4 mb-6">
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
                                                <CardDescription className="cursor-pointer" onClick={() => router.push("/profile/" + booking.listing.seller._id)}>
                                                    Booked from: {booking.listing.seller?.name ?? "Unknown seller"}
                                                </CardDescription>
                                                <p className="text-gray-600">Status: {booking.status}</p>
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

                        {activeTab === "My Listings" && (
                            <div className="space-y-4">
                                {listings.length === 0 ? (
                                    <p>You have no active listings.</p>
                                ) : (
                                    listings.map((listing) => (
                                        <Card key={listing._id} className="border-gray-200 cursor-pointer" onClick={() => router.push("/listings/" + listing._id)}>
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
                                                <CardDescription className="cursor-pointer" onClick={() => router.push("/profile/" + booking.renter._id)}>
                                                    Requested from: {booking.renter?.name ?? "Unknown renter"}
                                                </CardDescription>
                                                <CardDescription>Status: {booking.status}</CardDescription>
                                                <CardAction className="flex space-x-2">
                                                    {booking.status === "pending" && (
                                                        <>
                                                            <Button variant="outline" onClick={() => changeBookingStatus(booking._id, "confirmed")}>
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
                </Card>
            </div>

        </div>


    );
}