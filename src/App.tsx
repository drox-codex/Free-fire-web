/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from "@react-three/fiber";
import { Sky, PointerLockControls, KeyboardControls, Environment } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import { useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { motion } from "motion/react";

import { Player } from "./components/Player";
import { Arena } from "./components/Arena";
import { Enemy } from "./components/Enemy";
import { HUD } from "./components/HUD";
import { MobileControls } from "./components/MobileControls";

const ENEMY_SPAWNS: [number, number, number][] = [
  [10, 0, 10],
  [-10, 0, 15],
  [20, 0, -5],
  [-20, 0, -10],
  [5, 0, -20],
];

export default function App() {
  const [kills, setKills] = useState(0);
  const [health, setHealth] = useState(100);
  const [enemies, setEnemies] = useState(
    ENEMY_SPAWNS.map((pos, i) => ({ id: `enemy-${i}`, position: pos, health: 100 }))
  );
  
  const [bulletEffects, setBulletEffects] = useState<{ id: string; start: THREE.Vector3; end: THREE.Vector3 }[]>([]);

  const [hasStarted, setHasStarted] = useState(false);
  const [moveInput, setMoveInput] = useState({ x: 0, z: 0 });
  const playerRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const onEnemyHit = useCallback((id: string) => {
    setEnemies(prev => {
        const enemy = prev.find(e => e.id === id);
        if (!enemy) return prev;
        
        const newHealth = enemy.health - 25;
        if (newHealth <= 0) {
            setKills(k => k + 1);
            return prev.filter(e => e.id !== id);
        }
        
        return prev.map(e => e.id === id ? { ...e, health: newHealth } : e);
    });
  }, []);

  const onShoot = useCallback((position: THREE.Vector3, direction: THREE.Vector3) => {
    // Show a bullet trail
    const bulletId = Math.random().toString();
    const end = position.clone().add(direction.clone().multiplyScalar(50));
    setBulletEffects(prev => [...prev, { id: bulletId, start: position.clone(), end }]);
    setTimeout(() => {
      setBulletEffects(prev => prev.filter(b => b.id !== bulletId));
    }, 50);

    // Hit detection using Raycaster
    enemies.forEach(enemy => {
        const enemyCenter = new THREE.Vector3(...enemy.position);
        enemyCenter.y += 1; 
        
        const bulletRay = new THREE.Ray(position, direction);
        const distanceToEnemy = bulletRay.distanceToPoint(enemyCenter);
        
        if (distanceToEnemy < 0.8) { 
            const dist = position.distanceTo(enemyCenter);
            if (dist < 50) {
                onEnemyHit(enemy.id);
            }
        }
    });

  }, [enemies, onEnemyHit]);

  return (
    <div className="w-full h-full bg-ff-dark">
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas shadows camera={{ fov: 45, near: 0.1, far: 1000 }}>
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="night" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          
          <Physics gravity={[0, -9.81, 0]}>
            <Player onShoot={onShoot} moveInput={moveInput} />
            <Arena />
            {enemies.map((enemy) => (
              <Enemy key={enemy.id} id={enemy.id} position={enemy.position} onHit={onEnemyHit} />
            ))}
          </Physics>

          {!hasStarted && (
            <group position={[0, -0.5, 10]} rotation={[0, Math.PI, 0]}>
                <mesh position={[0, 1.6, -5]}>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <meshStandardMaterial color="#fff" />
                </mesh>
                <mesh position={[0, 0.7, -5]} castShadow>
                    <boxGeometry args={[0.8, 1.4, 0.4]} />
                    <meshStandardMaterial color="#ffcc00" metalness={0.7} roughness={0.2} />
                </mesh>
                <mesh position={[0, -0.1, -5]}>
                    <boxGeometry args={[0.8, 0.2, 0.8]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
            </group>
          )}

          {bulletEffects.map(bullet => (
             <BulletLine key={bullet.id} start={bullet.start} end={bullet.end} />
          ))}

          <PointerLockControls />
        </Canvas>
      </KeyboardControls>

      <HUD kills={kills} health={health} />
      
      {hasStarted && (
        <MobileControls 
          onMove={setMoveInput} 
          onShoot={() => {
              // Trigger a manual shoot if needed, though mouse click handles it
              // We'll dispatch a click for simplicity if on move
              window.dispatchEvent(new MouseEvent('mousedown'));
          }} 
          onJump={() => {
              // Dispatch space key
              window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
          }} 
        />
      )}
      
      {enemies.length === 0 && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-ff-dark/90 backdrop-blur-3xl z-[100] text-center p-8"
        >
             <h2 className="text-9xl font-black text-ff-yellow uppercase italic tracking-tighter mb-2 animate-pulse drop-shadow-[0_0_30px_rgba(255,204,0,0.5)]">BOOYAH!</h2>
             <p className="text-white text-3xl font-bold uppercase tracking-[0.2em] mb-12">Victory Royale</p>
             <button 
                className="bg-linear-to-b from-ff-yellow to-ff-orange text-black px-16 py-5 font-black uppercase text-2xl tracking-widest cursor-pointer hover:brightness-110 transition-all pointer-events-auto [clip-path:polygon(10%_0%,100%_0%,90%_100%,0%_100%)] shadow-[0_0_50px_rgba(255,153,0,0.3)]"
                onClick={() => window.location.reload()}
             >
                Play Again
             </button>
        </motion.div>
      )}

      {!hasStarted && (
        <div className="fixed inset-0 flex items-center justify-between bg-ff-dark/40 backdrop-blur-sm z-50 pointer-events-auto p-12 overflow-hidden">
          {/* Left Side: Character Preview */}
          <div className="hidden md:flex flex-col items-center justify-center w-1/3 h-full">
               <div className="relative">
                 <div className="absolute inset-0 bg-ff-yellow/20 blur-3xl rounded-full scale-150 animate-pulse" />
                 <div className="relative z-10 text-white/50 text-xs font-black uppercase tracking-[0.5em] mb-4">Character Preview</div>
               </div>
          </div>

          {/* Right Side: Menu */}
          <div className="bg-black/90 backdrop-blur-2xl p-12 rounded-xl border-l-4 border-ff-yellow shadow-2xl max-w-lg w-full">
               <div className="flex justify-between items-start mb-6">
                 <div className="bg-ff-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm">Event Live</div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/5">
                        <span className="text-ff-yellow text-xs">💎</span>
                        <span className="text-white text-[10px] font-bold">1,250</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/5">
                        <span className="text-ff-yellow text-xs">🪙</span>
                        <span className="text-white text-[10px] font-bold">25.4K</span>
                    </div>
                 </div>
               </div>

               <h1 className="text-6xl font-black text-white mb-2 uppercase tracking-tighter italic leading-none text-right">Free Fire<br/><span className="text-ff-yellow">Web Edition</span></h1>
               <p className="text-white/40 mb-10 text-sm font-medium tracking-wide uppercase text-right">Tactical. Intense. Survival.</p>
               
               <div className="grid grid-cols-3 gap-6 mb-12">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex flex-col items-center hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="text-2xl mb-1">🔫</span>
                    <span className="text-[10px] text-white/40 uppercase font-black">Combat</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex flex-col items-center hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="text-2xl mb-1">👕</span>
                    <span className="text-[10px] text-white/40 uppercase font-black">Vault</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex flex-col items-center hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="text-2xl mb-1">🐾</span>
                    <span className="text-[10px] text-white/40 uppercase font-black">Pet</span>
                  </div>
               </div>

               <button 
                onClick={() => setHasStarted(true)}
                className="w-full bg-linear-to-b from-ff-yellow to-ff-orange text-black px-12 py-5 font-black uppercase text-3xl tracking-tighter hover:scale-[1.02] active:scale-95 transition-all [clip-path:polygon(5%_0%,100%_0%,95%_100%,0%_100%)] cursor-pointer"
               >
                 Start Game
               </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BulletLine({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
  return (
    <line>
      <bufferGeometry attach="geometry" onUpdate={(self) => self.setFromPoints([start, end])} />
      <lineBasicMaterial attach="material" color="yellow" linewidth={1} opacity={0.5} transparent />
    </line>
  );
}

