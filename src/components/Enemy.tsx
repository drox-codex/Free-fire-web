import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export const Enemy = ({ position, id, onHit }: { position: [number, number, number], id: string, onHit: (id: string) => void }) => {
  const [health, setHealth] = useState(100);
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: [1, 2, 1],
  }));

  useFrame((state) => {
    // Just rotate and float slightly
    const time = state.clock.getElapsedTime();
    api.rotation.set(0, time * 2, 0);
    api.position.set(position[0], position[1] + Math.sin(time * 2) * 0.2 + 0.5, position[2]);
  });

  return (
    <group ref={ref as any}>
      <mesh castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.1} />
      </mesh>
      
      {/* Target Highlights */}
      <mesh position={[0, 0, 0.51]}>
         <planeGeometry args={[0.8, 1.8]} />
         <meshStandardMaterial color={health < 50 ? "#ff0000" : "#ffcc00"} emissive={health < 50 ? "#ff0000" : "#ffcc00"} emissiveIntensity={0.5} transparent opacity={0.2} />
      </mesh>

      <Html position={[0, 1.5, 0]} center distanceFactor={10}>
         <div className="flex flex-col items-center gap-1 w-24">
            <div className="w-full h-1.5 bg-black/80 rounded-full border border-white/20 overflow-hidden">
                <div 
                    className="h-full bg-ff-red transition-all duration-300"
                    style={{ width: `${health}%` }}
                />
            </div>
            <div className="text-[8px] font-black text-white/50 uppercase tracking-tighter">Bounty Target</div>
         </div>
      </Html>

      {/* Visual Indicator of Head */}
      <mesh position={[0, 1.2, 0]}>
         <sphereGeometry args={[0.3, 16, 16]} />
         <meshStandardMaterial color="#555" emissive="#ffcc00" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
};
