import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { SignOutButton } from "@/components/SignOutButton";

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
                            <a href="/">Home</a>
                        </Button>
                    </li>
                    <li>
                        <Button variant="link">
                            <a href="/search">Search</a>
                        </Button>
                    </li>
                    <li>
                        <Button variant="link">
                            <a href="/about">About</a>
                        </Button>
                    </li>
                </ul>
                {/* Sign out or sign in button */}
                <div className="">
                    {session?.user ? (
                        <div className="flex items-center gap-4">
                            {/* Clickable user name that leads to profile */}
                            <Button variant="link" asChild>
                                <a href="/profile">{session.user.name}</a>
                            </Button>
                            <SignOutButton />
                        </div>
                    ) : (
                        <Button variant="default">
                            <a href="/login">Sign In</a>
                        </Button>
                    )}
                </div>
            </header>
        </nav>
    );
}

export default Navbar;