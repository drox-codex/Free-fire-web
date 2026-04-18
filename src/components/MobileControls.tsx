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
    const max = 50;
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
    <div className="fixed inset-0 pointer-events-none z-40 md:hidden">
      {/* Joystick Area */}
      <div 
        className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full border border-white/20 flex items-center justify-center pointer-events-auto select-none"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
      >
        <motion.div 
          className="w-12 h-12 bg-ff-yellow rounded-full shadow-[0_0_20px_rgba(255,204,0,0.5)]"
          animate={{ x: joystickOffset.x, y: joystickOffset.y }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </div>

      {/* Buttons Area */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-6">
        {/* Jump Button */}
        <button 
          className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center pointer-events-auto active:scale-90 transition-transform"
          onTouchStart={(e) => { e.preventDefault(); onJump(); }}
        >
          <span className="text-2xl">🔼</span>
        </button>

        {/* Shoot Button */}
        <button 
          className="w-24 h-24 bg-ff-red/80 backdrop-blur-md rounded-full border-4 border-ff-yellow flex items-center justify-center pointer-events-auto active:scale-95 transition-transform shadow-[0_0_30px_rgba(255,0,51,0.4)]"
          onTouchStart={(e) => { e.preventDefault(); onShoot(); }}
        >
          <span className="text-3xl">🎯</span>
        </button>
      </div>
    </div>
  );
};
