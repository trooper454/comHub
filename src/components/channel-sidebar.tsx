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
      {/* TOP: User info block (your red box area) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 p-3 hover:bg-[#393c43] transition w-full text-left border-b border-[#202225]">
            <div className="relative shrink-0">
              <Avatar className="h-10 w-10">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="bg-[#5865f2] text-white font-semibold">
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#2f3136] ${statusColors[status]}`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-xs text-gray-400 capitalize">{status}</div>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="start"
          className="w-64 bg-[#36393f] border-[#202225] text-[#dcddde] shadow-xl"
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#202225]" />

          <DropdownMenuItem className="focus:bg-[#393c43]">
            <Smile className="mr-2 h-4 w-4" />
            Set Status Message...
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#202225]" />

          <DropdownMenuItem onSelect={() => setStatus("online")} className="focus:bg-[#393c43]">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2" /> Online
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatus("away")} className="focus:bg-[#393c43]">
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2" /> Away
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatus("busy")} className="focus:bg-[#393c43]">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-2" /> Busy
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatus("dnd")} className="focus:bg-[#393c43]">
            <div className="h-3 w-3 rounded-full bg-purple-500 mr-2" /> Do Not Disturb
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#202225]" />

          <DropdownMenuItem onSelect={() => setMicMuted(!micMuted)} className="focus:bg-[#393c43]">
            {micMuted ? (
              <MicOff className="mr-2 h-4 w-4" />
            ) : (
              <Mic className="mr-2 h-4 w-4" />
            )}
            {micMuted ? "Unmute Microphone" : "Mute Microphone"}
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setSpeakerMuted(!speakerMuted)} className="focus:bg-[#393c43]">
            {speakerMuted ? (
              <VolumeX className="mr-2 h-4 w-4" />
            ) : (
              <Volume2 className="mr-2 h-4 w-4" />
            )}
            {speakerMuted ? "Unmute Speakers" : "Mute Speakers"}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#202225]" />

          {/* Future family placeholder */}
          {/* <DropdownMenuItem className="focus:bg-[#393c43]">
            <Users className="mr-2 h-4 w-4" /> Manage Family...
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#202225]" /> */}

          <DropdownMenuItem
            className="focus:bg-[#393c43] text-red-400 focus:text-red-300"
            // onSelect={() => signOut()}  ← Wire your real logout here
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
