import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    title: "Katha — Every Plate Has a Story",
    description: "A generous Kerala table of curries, grills, biryani, shawarma, shakes and stories.",
    icons: { icon: "/katha-logo.svg", shortcut: "/katha-logo.svg" },
    openGraph: { title: "Katha — Every Plate Has a Story", description: "Kerala at heart. Open to the world.", images: [{ url: `${origin}/og.png`, width: 1200, height: 630 }], type: "website" },
    twitter: { card: "summary_large_image", title: "Katha — Every Plate Has a Story", description: "Kerala at heart. Open to the world.", images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
