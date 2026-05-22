import { Button } from "@/components/ui/button"

function Navbar() {
    return (
        <nav className="sticky top-0 z-40 w-full border-b border-separator">
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
                {/* Profile dropdown or sign in button */}
                <div className="">
                    <Button variant="default">
                        <a href="/login">Sign In</a>
                    </Button>
                </div>
            </header>
        </nav>
    );
}

export default Navbar;