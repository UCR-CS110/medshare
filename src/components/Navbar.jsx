
function Navbar() {
    return (
        <nav className="sticky top-0 z-40 w-full border-b border-separator">
            <header className="flex h-16 items-center justify-between px-4">
                <h1>MedShare</h1>
                {/* <Logo /> */}
                <ul className="flex space-x-4">
                    <li><a href="/">Home</a></li>
                    <li><a href="/search">Search</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
                {/* Profile dropdown */}
                <div className="">
                    <button className="flex items-center space-x-2">
                        <span>Profile</span>
                    </button>
                </div>
            </header>
        </nav>
    );
}

export default Navbar;