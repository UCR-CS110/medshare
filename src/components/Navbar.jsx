import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { SignOutButton } from "@/components/SignOutButton";
import Link from "next/link";

async function Navbar() {

    const session = await getServerSession(authOptions);

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
                            <Link href="/about">About</Link>
                        </Button>
                    </li>
                </ul>
                {/* Sign out or sign in button */}
                <div className="">
                    <Button variant="default">
                        <Link href="/login">Sign In</Link>
                    </Button>
                </div>
            </header>
        </nav>
    );
}

export default Navbar;