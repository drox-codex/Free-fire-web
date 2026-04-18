import { motion } from "motion/react";

export const HUD = ({ kills, health }: { kills: number, health: number }) => {
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-[30px] box-border">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/60 backdrop-blur-md border-l-4 border-ff-yellow p-[10px_20px] rounded-lg flex gap-4 items-center"
        >
          <div className="flex flex-col">
            <div className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Kills</div>
            <div className="text-white text-2xl font-black">{kills}</div>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-full border-2 border-ff-yellow flex items-center justify-center font-bold text-xs">LV</div>
        </motion.div>

        <div className="flex flex-col items-center">
             <div className="bg-ff-red text-white px-2 py-0.5 text-[8px] font-bold uppercase rounded-sm mb-[-4px] z-10">New</div>
             <div className="bg-black/80 border border-ff-yellow px-6 py-2 rounded-md text-center">
                <div className="text-white/60 text-[10px] uppercase font-bold mb-1">Current Mission</div>
                <div className="text-white text-lg font-bold uppercase tracking-tight italic">Eliminate Targets</div>
             </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur-md p-[5px_15px] rounded-md border border-white/10 flex items-center gap-2">
            <span className="text-ff-yellow font-bold">💎</span>
            <span className="text-white font-bold">1,250</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-[5px_15px] rounded-md border border-white/10 flex items-center gap-2 text-right">
            <span className="text-ff-yellow font-bold">🪙</span>
            <span className="text-white font-bold">25.4K</span>
          </div>
        </div>
      </div>

      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          <div className="w-[1px] h-4 bg-ff-yellow/60 absolute" />
          <div className="w-4 h-[1px] bg-ff-yellow/60 absolute" />
          <div className="w-0.5 h-0.5 bg-ff-yellow rounded-full" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1 w-72 mb-4">
          <div className="flex justify-between text-white text-[10px] uppercase tracking-widest font-black">
            <span className="flex items-center gap-2">
                <span className="w-1 h-3 bg-ff-yellow" />
                Health
            </span>
            <span>{health}%</span>
          </div>
          <div className="h-3 w-full bg-black/40 rounded-sm overflow-hidden border border-white/10">
            <motion.div 
              className="h-full bg-ff-yellow shadow-[0_0_10px_rgba(255,204,0,0.5)]"
              animate={{ width: `${health}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </div>

        <div className="bg-black/70 backdrop-blur-md border border-white/10 p-4 rounded-xl mb-4">
          <div className="text-white/40 text-[9px] uppercase tracking-wider font-bold mb-1 italic">Weapon System</div>
          <div className="text-white text-xl font-black uppercase tracking-tighter">Assault Rifle</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-white/40 text-[10px] uppercase tracking-tighter text-right">
        WASD: Move<br />
        SPACE: Jump<br />
        CLICK: Shoot<br />
        ESC: Unlock Mouse
      </div>
    </div>
  );
};
