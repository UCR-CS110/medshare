"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BadgeCheck, BriefcaseMedical, Mail, MapPin, Star, UserRound } from "lucide-react";

// Public profile page (redirect to /profile/me if viewing own profile)
export default function ProfilePage({ params }) {
    const { data: session } = useSession();
    const router = useRouter();
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchData() {
        setLoading(true);
        setError("");

        try {
            const [profileRes, listingsRes] = await Promise.all([
                fetch("/api/users/" + id),
                fetch("/api/users/" + id + "/listings"),
            ]);

            const profileJson = await profileRes.json();
            const listingsJson = await listingsRes.json();

            if (!profileRes.ok) {
                throw new Error(profileJson.error || "Failed to fetch profile data");
            }

            if (!listingsRes.ok) {
                throw new Error(listingsJson.error || "Failed to fetch listings");
            }

            setProfileData(profileJson);
            setListings(Array.isArray(listingsJson) ? listingsJson : []);
        } catch (error) {
            console.error("Error fetching profile data:", error);
            setError(error.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (session?.user?.id === id) {
            router.replace("/profile/me");
            return;
        }

        fetchData();
    }, [id, router, session?.user?.id]);

    if (loading) {
        return <div className="max-w-3xl mx-auto p-4">Loading...</div>;
    }

    if (error || !profileData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">Profile not found</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        {error || "The user profile you requested could not be loaded."}
                    </p>
                </div>
            </div>
        );
    }

    const { name, email, bio, isVerified, providerType, avgRating } = profileData;
    const providerLabel = {
        "medical-clinic": "Medical Clinic",
        "individual-caregiver": "Individual Caregiver",
        "non-profit-center": "Non-Profit Center",
    }[providerType] || "Provider";

    const listingCount = listings.length;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="border-b border-slate-100">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <CardTitle className="text-2xl">{name}</CardTitle>
                                        {isVerified ? (
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
                                        {email}
                                        <p className="mt-1 text-sm leading-6 text-slate-700">{bio || "No public bio has been added yet."}</p>
                                        <div className="flex flex-wrap gap-2 pt-2 text-sm text-slate-600">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                                                <BriefcaseMedical className="size-4" /> {providerLabel}
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                                                <Star className="size-4 text-amber-500" /> {avgRating ? avgRating.toFixed(1) : "New"}
                                            </span>
                                        </div>
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button asChild variant="outline">
                                    <a href={`mailto:${email}`}>
                                        <Mail className="size-4" /> Contact
                                    </a>
                                </Button>
                                <Button asChild>
                                    <Link href="#listings">View Listings</Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="">
                        <section id="listings" className="space-y-4">
                            <div>
                                <h2 className="text-xl font-semibold">Public Listings</h2>
                                <p className="mt-1 text-sm text-slate-600">Items currently available from this provider.</p>
                                {listingCount} listing{listingCount === 1 ? "" : "s"}
                            </div>

                            {listingCount === 0 ? (
                                <Card className="border-dashed border-slate-300">
                                    <CardHeader>
                                        <CardTitle className="text-base">No public listings yet</CardTitle>
                                        <CardDescription>This provider has not posted any equipment or services yet.</CardDescription>
                                    </CardHeader>
                                </Card>
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
                        </section>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}