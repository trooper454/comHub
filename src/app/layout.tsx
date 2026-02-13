import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"; // from shadcn
import { ServerSidebar } from "@/components/server-sidebar"; // we'll create
import { ChannelSidebar } from "@/components/channel-sidebar";
import { MainContent } from "@/components/main-content";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "comHub - a place for community hubs",
  description: "A family-friendly approach to gaming communities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        "bg-[#36393f] text-[#dcddde] antialiased h-screen overflow-hidden"
      )}>
        <div className="flex h-screen">
          {/* Server icons bar - narrow */}
          <ServerSidebar />

          {/* Channel list sidebar */}
          <ChannelSidebar />

          {/* Main chat area + right members (flex for now) */}
          <MainContent>{children}</MainContent>
        </div>
      </body>
    </html>
  );
}
