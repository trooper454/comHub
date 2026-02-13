export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col bg-[#36393f]">
      {/* Top bar later: server name, search */}
      <div className="h-14 bg-[#36393f] border-b border-[#202225] flex items-center px-4">
        <span className="font-semibold"># general</span>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 overflow-hidden">
        {children} {/* For now, your dashboard goes here; later messages list */}
      </div>
      
      {/* Input bar placeholder */}
      <div className="h-14 bg-[#40444b] p-2">
        <input 
          className="w-full h-full bg-[#40444b] text-white placeholder-gray-400 outline-none px-4 rounded"
          placeholder="Message #general..."
        />
      </div>
    </div>
  );
}
