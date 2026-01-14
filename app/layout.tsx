import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "90s Juke",
    description: "Analogue style music reviews",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className="antialiased min-h-screen p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </body>
        </html>
    );
}
