import { motion } from "motion/react";
import { useState } from "react";

export const MobileControls = ({ 
  onMove, 
  onShoot, 
  onJump 
}: { 
  onMove: (dir: { x: number; z: number }) => void;
  onShoot: () => void;
  onJump: () => void;
}) => {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [joystickOffset, setJoystickOffset] = useState({ x: 0, y: 0 });

  const handleJoystickMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    
    // Clamp to circle
    const distance = Math.sqrt(dx * dx + dy * dy);
    const max = 40; // Smaller for more precise control
    const limitedX = distance > max ? (dx / distance) * max : dx;
    const limitedY = distance > max ? (dy / distance) * max : dy;
    
    setJoystickOffset({ x: limitedX, y: limitedY });
    onMove({ x: limitedX / max, z: limitedY / max });
  };

  const handleJoystickStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleJoystickEnd = () => {
    setJoystickOffset({ x: 0, y: 0 });
    onMove({ x: 0, z: 0 });
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 xs:flex md:hidden">
      {/* Joystick Area */}
      <div 
        className="absolute bottom-12 left-12 w-28 h-28 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center pointer-events-auto select-none shadow-2xl"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
      >
        <div className="absolute inset-0 rounded-full border-t-2 border-ff-yellow/20" />
        <motion.div 
          className="w-10 h-10 bg-ff-yellow rounded-full shadow-[0_0_20px_rgba(255,204,0,0.5)] border-2 border-white/20 flex items-center justify-center"
          animate={{ x: joystickOffset.x, y: joystickOffset.y }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <div className="w-1.5 h-1.5 bg-black/40 rounded-full" />
        </motion.div>
      </div>

      {/* Buttons Area */}
      <div className="absolute bottom-12 right-12 flex flex-col items-end gap-5">
        <div className="flex gap-4 items-end">
            {/* Secondary Buttons (Maybe Reload later) */}
            <button className="w-12 h-12 bg-black/40 rounded-lg border border-white/10 pointer-events-auto flex items-center justify-center text-sm opacity-60">
                🔄
            </button>

            {/* Jump Button */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 bg-black/40 backdrop-blur-xl rounded-full border-2 border-white/10 flex items-center justify-center pointer-events-auto shadow-2xl"
              onTouchStart={(e) => { e.preventDefault(); onJump(); }}
            >
              <span className="text-xl">🦘</span>
            </motion.button>
        </div>

        {/* Shoot Button (Dominant) */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-28 h-28 bg-ff-red/90 backdrop-blur-xl rounded-full border-4 border-ff-yellow flex flex-col items-center justify-center pointer-events-auto shadow-[0_0_40px_rgba(255,0,51,0.5)] active:brightness-125 transition-all"
          onTouchStart={(e) => { e.preventDefault(); onShoot(); }}
        >
          <span className="text-4xl mb-[-4px]">🔥</span>
          <span className="text-[10px] font-black uppercase text-white tracking-widest mt-1">Attack</span>
        </motion.button>
      </div>
    </div>
  );
};
