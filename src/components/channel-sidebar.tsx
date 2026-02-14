// src/components/channel-sidebar.tsx
"use client"; // Needed for interactive state (menu, toggles)

import { useState } from "react";
import { useServer } from "@/context/ServerContext";
import { Button } from "@/components/ui/button";
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
import { Mic, MicOff, Volume2, VolumeX, LogOut, Smile, Clock, Ban, MoreVertical } from "lucide-react";


const useUserSession = () => {
  // Placeholder — swap with real hook
  return {
    user: { name: "jamie!", image: null, id: "placeholder" },
    status: "online" as const,
  };
};

export function ChannelSidebar() {
  const { user, status: initialStatus } = useUserSession(); // ← Your real session hook here
  const { activeServerId } = useServer();
  const [status, setStatus] = useState<"online" | "away" | "busy" | "dnd">(initialStatus || "online");
  const [micMuted, setMicMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);

  const [activeServer, setActiveServer] = useState<{ name: string } | null>(null);
  
  useEffect(() => {
    if (activeServerId) {
      // Fetch /api/servers/[id] or filter from global list
      setActiveServer({ name: "Fetched Name" }); // stub
    } else {
      setActiveServer(null);
    }
  }, [activeServerId]);

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
      <div className="p-4 font-bold border-b border-[#202225] flex items-center justify-between">
        <span className="truncate">{activeServerName}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#36393f] border-[#202225] text-[#dcddde]">
            <DropdownMenuItem className="focus:bg-[#393c43]">
              Invite People
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-[#393c43]">
              Server Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#202225]" />
            <DropdownMenuItem className="text-red-400 focus:bg-[#393c43] focus:text-red-300">
              Leave Server
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
