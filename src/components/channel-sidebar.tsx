// src/components/channel-sidebar.tsx
"use client"; // Needed for interactive state (menu, toggles)

import { useState } from "react";
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
import { Mic, MicOff, Volume2, VolumeX, LogOut, Smile, Clock, Ban } from "lucide-react";

// REPLACE these with your actual session import & signOut
// Example for NextAuth:
// import { useSession, signOut } from "next-auth/react";
// For Clerk: import { useUser, SignOutButton } from "@clerk/nextjs";
// For custom: adjust accordingly
const useUserSession = () => {
  // Placeholder — swap with real hook
  return {
    user: { name: "jamie!", image: null, id: "placeholder" },
    status: "online" as const,
  };
};

export function ChannelSidebar() {
  const { user, status: initialStatus } = useUserSession(); // ← Your real session hook here

  const [status, setStatus] = useState<"online" | "away" | "busy" | "dnd">(initialStatus || "online");
  const [micMuted, setMicMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);

  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    dnd: "bg-purple-500",
  };

  if (!user) {
    return (
      <div className="w-60 bg-[#2f3136] p-4 text-center text-gray-400">
        Not logged in
      </div>
    );
  }

  return (
    <div className="w-60 bg-[#2f3136] flex flex-col h-full">
      {/* Server name header */}
      <div className="p-3 font-semibold border-b border-[#202225] flex items-center">
        Selected Server
      </div>

      {/* Scrollable channel list */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        <div>
          <div className="text-xs uppercase text-gray-400 px-2 mb-2">Text Channels</div>
          <div className="space-y-0.5">
            <button className="w-full text-left px-3 py-1.5 hover:bg-[#393c43] rounded-md flex items-center text-sm">
              # general
            </button>
            <button className="w-full text-left px-3 py-1.5 hover:bg-[#393c43] rounded-md flex items-center text-sm">
              # memes
            </button>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase text-gray-400 px-2 mb-2">Voice Channels</div>
          <div className="space-y-0.5">
            <button className="w-full text-left px-3 py-1.5 hover:bg-[#393c43] rounded-md flex items-center text-sm">
              🔊 Squad Chat (Listen + Talk)
            </button>
            <button className="w-full text-left px-3 py-1.5 hover:bg-[#393c43] rounded-md flex items-center text-sm opacity-75">
              🔇 Raid Coord (Listen Only)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
