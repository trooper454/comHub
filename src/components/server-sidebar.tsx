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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Mic, MicOff, Volume2, VolumeX, LogOut, Smile } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthRefresh } from "@/context/AuthContext";

type User = {
  id: string;
  username?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
};

type Server = {
  id: string;
  name: string;
  iconUrl?: string | null;
  isOwner: boolean;
};

export function ServerSidebar() {
  const router = useRouter();
  const triggerRefresh = useAuthRefresh();

  const [user, setUser] = useState<User | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingServers, setLoadingServers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<"online" | "away" | "busy" | "dnd">("online");
  const [micMuted, setMicMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false); // modal open state

  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    dnd: "bg-purple-500",
  };

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const res = await fetch("/api/user", {
          credentials: "include",
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
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [router, triggerRefresh]);

  // Fetch servers when user is loaded
  useEffect(() => {
    const fetchServers = async () => {
      if (!user) return;
      setLoadingServers(true);
      try {
        const res = await fetch("/api/servers", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setServers(data.servers || []);
        } else {
          setServers([]);
        }
      } catch (err) {
        console.error("Servers fetch error:", err);
        setServers([]);
      } finally {
        setLoadingServers(false);
      }
    };
    fetchServers();
  }, [user, router, triggerRefresh]);

  // Visibility change re-fetch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user) {
        // Re-fetch both user and servers
        fetchUser();
        // fetchServers();  // Uncomment if you extract fetchServers outside
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user, router]);

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

  if (loadingUser) {
    return (
      <div className="w-20 bg-[#202225] flex flex-col items-center py-3">
        <div className="h-12 w-12 rounded-full bg-[#36393f] animate-pulse" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="w-20 bg-[#202225] flex flex-col items-center py-3 text-red-400 text-xs">
        Error
      </div>
    );
  }

  const displayName = user.username || user.name || "User";
  const avatarSrc = user.avatarUrl || null;

  return (
    <div className="w-20 bg-[#202225] flex flex-col items-center py-3 space-y-4">
      {/* Top: Real logged-in user pill */}
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

      {/* Real servers list */}
      {loadingServers ? (
        <div className="text-gray-500 text-xs animate-pulse">Loading servers...</div>
      ) : servers.length === 0 ? (
        <div className="text-gray-500 text-xs">No servers yet</div>
      ) : (
        servers.map((server) => (
          <button
            key={server.id}
            className="group relative focus:outline-none"
            // onClick={() => setActiveServer(server.id)} // add later
          >
            <Avatar className="h-12 w-12 rounded-full transition-all group-hover:rounded-2xl">
              {server.iconUrl ? (
                <AvatarImage src={server.iconUrl} alt={server.name} />
              ) : (
                <AvatarFallback className="bg-[#36393f] text-white font-semibold">
                  {server.name[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              )}
              {server.isOwner && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold px-1 rounded-full border-2 border-[#202225]">
                  👑
                </span>
              )}
            </Avatar>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
              {server.name}
              {server.isOwner && " (Owner)"}
            </div>
          </button>
        ))
      )}

     {/* + button opens dialog */}
     <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
       <DialogTrigger asChild>
         <button className="rounded-full bg-[#3ba55c] p-3 hover:bg-[#2e8b4f] transition">
           <Plus className="h-6 w-6 text-white" />
         </button>
       </DialogTrigger>
     
       <DialogContent className="sm:max-w-[425px] bg-[#2f3136] text-[#dcddde] border-[#202225]">
         <DialogHeader>
           <DialogTitle className="text-xl">Server Management</DialogTitle>
         </DialogHeader>
     
         <Tabs defaultValue="create" className="mt-4">
           <TabsList className="grid w-full grid-cols-2 bg-[#36393f]">
             <TabsTrigger value="create">Create</TabsTrigger>
             <TabsTrigger value="join">Join</TabsTrigger>
           </TabsList>
     
           <TabsContent value="create" className="space-y-4">
             <form
               onSubmit={async (e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
     
                 try {
                   const res = await fetch("/api/servers", {
                     method: "POST",
                     body: formData,
                     credentials: "include",
                   });
     
                   const data = await res.json();
     
                   if (res.ok) {
                     setDialogOpen(false);
                     triggerRefresh();  // Re-fetch user/servers in sidebar
                     // Optional: toast success
                   } else {
                     alert(data.error || "Failed to create server");
                   }
                 } catch (err) {
                   console.error(err);
                   alert("Network error");
                 }
               }}
             >
               <div className="space-y-2">
                 <Label htmlFor="name">Server Name</Label>
                 <Input
                   id="name"
                   name="name"
                   placeholder="My Friday Night Raid Group"
                   className="bg-[#383a40] border-[#202225] text-white placeholder-gray-400"
                   required
                 />
               </div>
               <Button type="submit" className="w-full mt-6 bg-[#5865f2] hover:bg-[#4752c4]">
                 Create Server
               </Button>
             </form>
           </TabsContent>
     
           <TabsContent value="join" className="space-y-4">
             <form
               onSubmit={async (e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
     
                 try {
                   const res = await fetch("/api/servers/join", {
                     method: "POST",
                     body: formData,
                     credentials: "include",
                   });
     
                   const data = await res.json();
     
                   if (res.ok) {
                     setDialogOpen(false);
                     triggerRefresh();  // Sidebar updates with new server
                   } else {
                     alert(data.error || "Failed to join server");
                   }
                 } catch (err) {
                   console.error(err);
                   alert("Network error");
                 }
               }}
             >
               <div className="space-y-2">
                 <Label htmlFor="code">Invite Code</Label>
                 <Input
                   id="code"
                   name="code"
                   placeholder="abc123"
                   className="bg-[#383a40] border-[#202225] text-white placeholder-gray-400"
                   required
                 />
               </div>
               <Button type="submit" className="w-full mt-6 bg-[#3ba55c] hover:bg-[#2e8b4f]">
                 Join Server
               </Button>
             </form>
           </TabsContent>
         </Tabs>
       </DialogContent>
     </Dialog>
    </div>
  );
}
