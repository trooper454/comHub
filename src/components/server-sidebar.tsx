// Simple server icon list (static + your real servers later)
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ServerSidebar() {
  // Later: fetch user's servers via server component or hook
  const mockServers = ["MyServer", "MyEscape", "RaidGroup"];

  return (
    <div className="w-20 bg-[#202225] flex flex-col items-center py-3 space-y-4">
      {/* Home icon or ComHub logo */}
      <Avatar className="h-12 w-12 bg-[#5865f2] text-white">
        <span className="text-xl font-bold">CH</span>
      </Avatar>

      <div className="w-10 h-px bg-gray-700" />

      {/* Server icons */}
      {mockServers.map((name) => (
        <button key={name} className="group relative">
          <Avatar className="h-12 w-12 rounded-full transition-all group-hover:rounded-2xl">
            <AvatarFallback className="bg-[#36393f] text-white font-semibold">
              {name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
            {name}
          </div>
        </button>
      ))}

      <Button variant="ghost" size="icon" className="rounded-full bg-[#3ba55c] hover:bg-[#2e8b4f]">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
