// src/components/server-sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Mic, MicOff, Volume2, VolumeX, LogOut, Smile } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthRefresh } from "@/context/AuthContext";  // ← this line

type User = {
  id: string;
  username?: string | null;
  name?: string | null;
  avatarUrl?: string | null;  // adjust field name if your User model uses different name
  // add email or other fields if you want to display them
};

export function ServerSidebar() {
  const router = useRouter();
  const triggerRefresh = useAuthRefresh();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<"online" | "away" | "busy" | "dnd">("online");
  const [micMuted, setMicMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);

  // Status dot colors
  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    dnd: "bg-purple-500",
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user", {
      credentials: "include", // important for cookie-based sessions
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("User fetch error:", err);
      setError("Could not load user info");
    } finally {
      setLoading(false);
    }
  };

  useEffect (() => {
    fetchUser();
  }, [router, triggerRefresh]);

  // Inside server-sidebar.tsx useEffect block (add if missing)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchUser();  // your fetchUser function that calls /api/user
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [router]);

  // Optional: window focus fallback
  useEffect(() => {
    const handleFocus = () => fetchUser();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/login");
        router.refresh();
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Mock servers — replace with real data later
  const servers = ["MyServer", "MyEscape", "RaidGroup"];

  if (loading) {
    return (
      <div className="w-20 bg-[#202225] flex flex-col items-center py-3">
        <div className="h-12 w-12 rounded-full bg-[#36393f] animate-pulse" />
      </div>
    );
  }

  if (!user) {
	  router.push("/login");
  }

  if (error) {
    return (
      <div className="w-20 bg-[#202225] flex flex-col items-center py-3 text-red-400 text-xs">
        Error
      </div>
    );
  }

  const displayName = user.username || user.name || "User";
  const avatarSrc = user.avatarUrl || null; // adjust field if different

  return (
    <div className="w-20 bg-[#202225] flex flex-col items-center py-3 space-y-4">
      {/* Top: Real logged-in user pill – "you are your own server" */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group relative focus:outline-none focus:ring-2 focus:ring-[#5865f2] rounded-full">
            <div className="relative">
              <Avatar className="h-12 w-12 rounded-full transition-all group-hover:rounded-2xl">
                {avatarSrc ? (
                  <AvatarImage src={avatarSrc} alt={displayName} />
                ) : (
                  <AvatarFallback className="bg-[#5865f2] text-white font-bold text-xl">
                    {displayName[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <span
                className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#202225] ${statusColors[status]}`}
              />
            </div>

            {/* Hover tooltip */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black/90 text-white text-sm px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
              {displayName} • {status}
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="start"
          className="w-64 bg-[#36393f] border border-[#202225] text-[#dcddde] shadow-xl"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <span className="font-medium">{displayName}</span>
              {user.username && user.name && (
                <span className="text-xs text-gray-400">@{user.username}</span>
              )}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-[#202225]" />

          <DropdownMenuItem className="focus:bg-[#393c43]">
            <Smile className="mr-2 h-4 w-4" />
            Set status message...
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#202225]" />

          <DropdownMenuItem onSelect={() => setStatus("online")} className="focus:bg-[#393c43]">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2" />
            Online
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatus("away")} className="focus:bg-[#393c43]">
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2" />
            Away
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatus("busy")} className="focus:bg-[#393c43]">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-2" />
            Busy
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatus("dnd")} className="focus:bg-[#393c43]">
            <div className="h-3 w-3 rounded-full bg-purple-500 mr-2" />
            Do Not Disturb
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#202225]" />

          <DropdownMenuItem onSelect={() => setMicMuted(!micMuted)} className="focus:bg-[#393c43]">
            {micMuted ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {micMuted ? "Unmute mic" : "Mute mic"}
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setSpeakerMuted(!speakerMuted)} className="focus:bg-[#393c43]">
            {speakerMuted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
            {speakerMuted ? "Unmute speakers" : "Mute speakers"}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#202225]" />

          <DropdownMenuItem
            className="text-red-400 focus:bg-[#393c43] focus:text-red-300 cursor-pointer"
            onSelect={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Divider */}
      <div className="w-10 h-px bg-gray-700 my-2" />

      {/* Joined servers */}
      {servers.map((name) => (
        <button
          key={name}
          className="group relative focus:outline-none"
          // onClick={() => setActiveServer(name)}  // ← add later for active server logic
        >
          <Avatar className="h-12 w-12 rounded-full transition-all group-hover:rounded-2xl bg-[#36393f]">
            <AvatarFallback className="text-white font-semibold">
              {name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
            {name}
          </div>
        </button>
      ))}

      {/* Create server button */}
      <button className="mt-2 rounded-full bg-[#3ba55c] p-3 hover:bg-[#2e8b4f] transition">
        <Plus className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}
