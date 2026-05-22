// Don't include navbar in this (auth) layout

export default function AuthLayout({ children }) {
    return (
        <div>
            <main>{children}</main>
        </div>
    );
}