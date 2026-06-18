"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { SignOutButton } from "@/components/SignOutButton";
import Link from "next/link";

function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background">
            <header className="flex h-16 items-center justify-between px-4">
                <h1 className="">MedShare</h1>
                {/* <Logo /> */}
                <ul className="flex space-x-4">
                    <li>
                        <Button variant="link">
                            <Link href="/">Home</Link>
                        </Button>
                    </li>
                    <li>
                        <Button variant="link">
                            <Link href="/search">Search</Link>
                        </Button>
                    </li>
                    <li>
                        <Button variant="link">
                            <Link href="/post">Post Equipment</Link>
                        </Button>
                    </li>
                    {session?.user?.role === "admin" ? (
                        <li>
                            <Button variant="link">
                                <Link href="/admin">Admin</Link>
                            </Button>
                        </li>
                    ) : null}
                    <li>
                        <Button variant="link">
                            <Link href="/about">About</Link>
                        </Button>
                    </li>
                </ul>
                {/* Sign out or sign in button */}
                <div className="">
                    {session?.user ? (
                        <div className="flex items-center gap-4">
                            <Button variant="link" asChild>
                                <Link href="/profile/me">{session.user.name}</Link>
                            </Button>
                            <SignOutButton />
                        </div>
                    ) : (
                        <Button variant="default">
                            <Link href="/login">Sign In</Link>
                        </Button>
                    )}
                </div>
            </header>
        </nav>
    );
}

export default Navbar;