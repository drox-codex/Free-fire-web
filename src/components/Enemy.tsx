import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";
import * as THREE from "three";

export const Enemy = ({ position, id, onHit }: { position: [number, number, number], id: string, onHit: (id: string) => void }) => {
  const [health, setHealth] = useState(100);
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: [1, 2, 1],
    onCollide: (e) => {
        // We could handle physical collisions here, but shooting is raycast
    }
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
        <meshStandardMaterial color={health < 50 ? "red" : "darkred"} />
      </mesh>
      {/* Visual Indicator of Hitbox */}
      <mesh position={[0, 1.2, 0]}>
         <boxGeometry args={[0.5, 0.1, 0.1]} />
         <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
};
