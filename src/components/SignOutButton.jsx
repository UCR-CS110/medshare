"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function SignOutButton() {

    async function handleSignOut() {
        await signOut({ redirect: false });
        window.location.href = "/login";
    }

    return (
        <Button variant="default" onClick={handleSignOut}>
            Sign Out
        </Button>
    )
}