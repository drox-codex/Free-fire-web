import { motion } from "motion/react";

export const HUD = ({ kills, health }: { kills: number, health: number }) => {
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-[30px] box-border font-sans select-none overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-start gap-2 sm:gap-4">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-black/60 backdrop-blur-md border-l-4 border-ff-yellow p-2 sm:p-[10px_20px] rounded-lg flex gap-2 sm:gap-4 items-center"
        >
          <div className="flex flex-col">
            <div className="text-white/60 text-[8px] sm:text-[10px] uppercase tracking-widest font-black">Eliminations</div>
            <div className="text-white text-xl sm:text-2xl font-black">{kills}</div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-ff-yellow/20 rounded-full border-2 border-ff-yellow flex items-center justify-center font-black text-[10px] sm:text-xs text-ff-yellow">LV.45</div>
        </motion.div>

        {/* Center Mission (Hidden on very small screens or made smaller) */}
        <div className="hidden xs:flex flex-col items-center">
             <div className="bg-ff-red text-white px-2 py-0.5 text-[7px] sm:text-[8px] font-black uppercase rounded-sm mb-[-4px] z-10 shadow-[0_0_10px_rgba(255,0,51,0.5)]">Priority</div>
             <div className="bg-black/80 border border-ff-yellow/50 backdrop-blur-xl px-4 sm:px-6 py-1.5 sm:py-2 rounded-md text-center shadow-2xl">
                <div className="text-white/40 text-[7px] sm:text-[9px] uppercase font-black mb-0.5 sm:mb-1">Zone Objective</div>
                <div className="text-white text-xs sm:text-sm font-black uppercase tracking-tight italic">Clear the Perimeter</div>
             </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="bg-black/60 backdrop-blur-md p-1.5 sm:p-[5px_15px] rounded-md border border-white/5 flex items-center gap-1.5 sm:gap-2">
            <span className="text-ff-yellow text-xs sm:text-sm">💎</span>
            <span className="text-white text-xs sm:text-sm font-black">1.2K</span>
          </div>
          <div className="bg-black/60 backdrop-blur-md p-1.5 sm:p-[5px_15px] rounded-md border border-white/5 flex items-center gap-1.5 sm:gap-2">
            <span className="text-ff-yellow text-xs sm:text-sm">🪙</span>
            <span className="text-white text-xs sm:text-sm font-black">25K+</span>
          </div>
        </div>
      </div>

      {/* Crosshair (Adaptive size) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 sm:w-8 sm:h-8 border border-white/20 rounded-full flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-[1px] h-3 sm:h-4 bg-ff-yellow/40 absolute" 
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-3 sm:w-4 h-[1px] bg-ff-yellow/40 absolute" 
          />
          <div className="w-0.5 h-0.5 bg-ff-yellow rounded-full shadow-[0_0_5px_#ffcc00]" />
        </div>
      </div>

      {/* Bottom Interface */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
        {/* Health Bar (Better mobile layout) */}
        <div className="flex flex-col gap-1 w-full sm:w-72 max-w-[200px] sm:max-w-none">
          <div className="flex justify-between text-white text-[8px] sm:text-[10px] uppercase tracking-widest font-black italic">
            <span className="flex items-center gap-2">
                <motion.span 
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-3 sm:h-4 bg-ff-yellow" 
                />
                Health Armor
            </span>
            <span className="text-ff-yellow">{health}%</span>
          </div>
          <div className="h-2.5 sm:h-3.5 w-full bg-black/60 rounded-sm overflow-hidden border border-white/10 p-[1px]">
            <motion.div 
              className="h-full bg-ff-yellow rounded-xs shadow-[0_0_15px_rgba(255,204,0,0.6)]"
              animate={{ width: `${health}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
          </div>
        </div>

        {/* Weapon & Inventory Display */}
        <div className="flex items-end gap-2 sm:gap-4">
            <div className="hidden sm:flex flex-col gap-1 items-end opacity-40">
                <div className="w-10 h-10 bg-black/40 border border-white/5 rounded-lg flex items-center justify-center text-xs">🎒</div>
                <div className="w-10 h-10 bg-black/40 border border-white/5 rounded-lg flex items-center justify-center text-xs">🏥</div>
            </div>
            
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-linear-to-tr from-black/80 to-ff-dark border-r-4 border-ff-yellow p-3 sm:p-5 rounded-xl shadow-2xl min-w-[140px] sm:min-w-[180px]"
            >
                <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <div className="text-white/30 text-[7px] sm:text-[9px] uppercase tracking-widest font-black italic">Assault System v4</div>
                    <div className="text-ff-yellow text-[8px] sm:text-[10px] font-black">AR</div>
                </div>
                <div className="text-white text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none mb-1">M4A1-S</div>
                <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-0.5 sm:h-1 flex-1 rounded-full ${i <= 4 ? 'bg-ff-yellow' : 'bg-white/10'}`} />
                    ))}
                </div>
            </motion.div>
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
