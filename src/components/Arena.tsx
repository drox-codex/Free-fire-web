import { usePlane, useBox } from "@react-three/cannon";
import { Stars, Cloud, Sky } from "@react-three/drei";

export const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#1a1a1a">
        <canvasTexture 
           attach="map" 
           image={(() => {
             const canvas = document.createElement('canvas');
             canvas.width = 512;
             canvas.height = 512;
             const ctx = canvas.getContext('2d')!;
             ctx.fillStyle = '#1a1a1a';
             ctx.fillRect(0,0,512,512);
             ctx.strokeStyle = '#ffcc0022';
             ctx.lineWidth = 2;
             // Draw grid
             for(let i=0; i<=512; i+=64) {
               ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
               ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
             }
             return canvas;
           })()} 
           repeat={[20, 20]} 
           wrapS={1000} 
           wrapT={1000} 
        />
      </meshStandardMaterial>
    </mesh>
  );
};

export const Obstacle = ({ position, size = [1, 1, 1], color = "gray", opacity = 1 }: any) => {
  const [ref] = useBox(() => ({
    type: "Static",
    position,
    args: size,
  }));

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={color} 
        transparent={opacity < 1} 
        opacity={opacity} 
        metalness={0.6}
        roughness={0.2}
      />
      {/* Decorative lines */}
      <mesh position={[0, size[1]/2 + 0.01, 0]}>
         <planeGeometry args={[size[0] * 0.9, size[2] * 0.9]} />
         <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.2} transparent opacity={0.1} />
      </mesh>
    </mesh>
  );
};

export const Arena = () => {
  return (
    <>
      <Ground />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Central Complex */}
      <Obstacle position={[0, 1, 0]} size={[4, 2, 4]} color="#222" />
      <Obstacle position={[0, 4, 0]} size={[2, 4, 2]} color="#333" />
      
      {/* Tactical Covers */}
      <Obstacle position={[10, 0.5, 10]} size={[3, 1, 0.5]} color="#444" />
      <Obstacle position={[12, 0.5, 8]} size={[0.5, 1, 3]} color="#444" />
      
      <Obstacle position={[-10, 0.5, -10]} size={[3, 1, 0.5]} color="#444" />
      <Obstacle position={[-12, 0.5, -8]} size={[0.5, 1, 3]} color="#444" />

      {/* Industrial Containers */}
      <Obstacle position={[15, 1.25, 0]} size={[2.5, 2.5, 5]} color="#0055ff" />
      <Obstacle position={[15, 1.25, 6]} size={[2.5, 2.5, 5]} color="#ff3300" />
      
      {/* Tall Towers */}
      <Obstacle position={[30, 10, 30]} size={[5, 20, 5]} color="#111" />
      <Obstacle position={[-30, 10, 30]} size={[5, 20, 5]} color="#111" />
      <Obstacle position={[30, 10, -30]} size={[5, 20, 5]} color="#111" />
      <Obstacle position={[-30, 10, -30]} size={[5, 20, 5]} color="#111" />

      {/* Decorative Neon Gates */}
      <Obstacle position={[0, 5, 25]} size={[20, 0.5, 0.5]} color="#ffcc00" opacity={0.5} />
      <Obstacle position={[0, 5, -25]} size={[20, 0.5, 0.5]} color="#ffcc00" opacity={0.5} />
    </>
  );
};
