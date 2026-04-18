import { usePlane, useBox } from "@react-three/cannon";

export const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  );
};

export const Obstacle = ({ position, size = [1, 1, 1], color = "gray" }: any) => {
  const [ref] = useBox(() => ({
    type: "Static",
    position,
    args: size,
  }));

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export const Arena = () => {
  return (
    <>
      <Ground />
      <Obstacle position={[5, 1, 5]} size={[2, 2, 2]} color="#444" />
      <Obstacle position={[-5, 1.5, 5]} size={[3, 3, 3]} color="#555" />
      <Obstacle position={[0, 2, -10]} size={[10, 4, 1]} color="#666" />
      <Obstacle position={[10, 1, -5]} size={[2, 2, 2]} color="#444" />
      <Obstacle position={[-10, 1, -5]} size={[2, 2, 2]} color="#444" />
      
      {/* City-like structures */}
      <Obstacle position={[15, 5, 15]} size={[5, 10, 5]} color="#333" />
      <Obstacle position={[-15, 5, 15]} size={[5, 10, 5]} color="#333" />
      <Obstacle position={[15, 5, -15]} size={[5, 10, 5]} color="#333" />
      <Obstacle position={[-15, 5, -15]} size={[5, 10, 5]} color="#333" />
    </>
  );
};
