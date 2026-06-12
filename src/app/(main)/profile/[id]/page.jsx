"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Public profile page (redirect to /profile/me if viewing own profile)
export default function ProfilePage({ params }) {
    const { data: session } = useSession();
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    async function fetchData() {
        try {
            const res = await fetch("/api/users/" + id);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to fetch profile data");
            setProfileData(data);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setLoading(false);
        }
        console.log("Fetched profile data:", profileData);
    }

    useEffect(() => {
        fetchData();
    }, []);

    // If user is viewing their own profile, redirect to /profile/me
    if (session?.user && session.user.id === id) {
        window.location.href = "/profile/me";
        return null;
    }

    // Display nothing if there is no profile data matching the ID (e.g. if user tries to access /profile/some-invalid-id)
    if (loading) {
        return <div className="max-w-3xl mx-auto p-4">Loading...</div>;
    }

    if (!profileData) {
        return <div className="max-w-3xl mx-auto p-4">Profile not found.</div>;
    }

    const { name, email, bio } = profileData;
    const profileFields = [
        { label: "Name", value: name },
        { label: "Email", value: email },
        { label: "Bio", value: bio },
    ];

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{name}'s Profile</h1>
            <div className="space-y-2">
                {profileFields.map(({ label, value }, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{label}</CardTitle>
                            <CardDescription>{value}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}