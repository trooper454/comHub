// src/components/server-sidebar.tsx
"use client";

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
import { Plus, Mic, MicOff, Volume2, VolumeX, LogOut, Smile } from "lucide-react";

// REPLACE with your real session hook (e.g. useSession from next-auth, or Clerk's useUser)
const useUser = () => ({
  name: "jamie!",
  image: null, // or real profile pic URL
  status: "online" as const,
});

export function ServerSidebar() {
  const user = useUser();
  const [status, setStatus] = useState(user.status || "online");
  const [micMuted, setMicMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);

  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    dnd: "bg-purple-500",
  };

  // Mock servers — replace with real fetch later
  const servers = ["MyServer", "MyEscape"];

  return (
    <div className="w-20 bg-[#202225] flex flex-col items-center py-3 space-y-4">
      {/* Top: User avatar (your "you are your own server" pill) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group relative">
            <div className="relative">
              <Avatar className="h-12 w-12 rounded-full transition-all group-hover:rounded-2xl">
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-[#5865f2] text-white font-bold">
                    {user.name?.[0]?.toUpperCase() ?? "J"}
                  </AvatarFallback>
                )}
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#202225] ${statusColors[status]}`}
              />
            </div>
            {/* Tooltip for username */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
              {user.name} • {status}
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="start"
          className="w-64 bg-[#36393f] border-[#202225] text-[#dcddde]"
        >
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem><Smile className="mr-2 h-4 w-4" /> Set Status Message...</DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setStatus("online")}>
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2" /> Online
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatus("away")}>
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2" /> Away
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatus("busy")}>
            <div className="h-3 w-3 rounded-full bg-red-500 mr-2" /> Busy
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatus("dnd")}>
            <div className="h-3 w-3 rounded-full bg-purple-500 mr-2" /> Do Not Disturb
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setMicMuted(!micMuted)}>
            {micMuted ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {micMuted ? "Unmute Mic" : "Mute Mic"}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSpeakerMuted(!speakerMuted)}>
            {speakerMuted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
            {speakerMuted ? "Unmute Speaker" : "Mute Speaker"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-red-400 focus:text-red-300">
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-10 h-px bg-gray-700 my-2" />

      {/* Your servers below */}
      {servers.map((name) => (
        <button key={name} className="group relative">
          <Avatar className="h-12 w-12 rounded-full transition-all group-hover:rounded-2xl bg-[#36393f]">
            <AvatarFallback className="text-white font-semibold">
              {name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
            {name}
          </div>
        </button>
      ))}

      <button className="rounded-full bg-[#3ba55c] hover:bg-[#2e8b4f] p-3">
        <Plus className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}
