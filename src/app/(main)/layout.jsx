// Include navbar in this (main) layout
import Navbar from "@/components/Navbar";

export default function MainLayout({ children }) {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
        </div>
    );
}