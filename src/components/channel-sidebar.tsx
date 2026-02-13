export function ChannelSidebar() {
  return (
    <div className="w-60 bg-[#2f3136] flex flex-col">
      <div className="p-4 font-bold border-b border-[#202225]">Selected Server</div>
      <div className="p-2 space-y-2">
        <div className="text-xs uppercase text-gray-400 px-2">Text Channels</div>
        <button className="w-full text-left px-4 py-1 hover:bg-[#393c43] rounded">general</button>
        <button className="w-full text-left px-4 py-1 hover:bg-[#393c43] rounded">memes</button>
        
        <div className="text-xs uppercase text-gray-400 px-2 mt-4">Voice Channels</div>
        <button className="w-full text-left px-4 py-1 hover:bg-[#393c43] rounded flex items-center">
          <span className="mr-2">🔊</span> Squad Chat (Listen + Talk)
        </button>
        <button className="w-full text-left px-4 py-1 hover:bg-[#393c43] rounded flex items-center">
          <span className="mr-2">🔇</span> Raid Coord (Listen Only)
        </button>
      </div>
    </div>
  );
}
