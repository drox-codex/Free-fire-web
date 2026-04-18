import { useSphere } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";

export const Player = ({ onShoot, moveInput }: { onShoot: (position: THREE.Vector3, direction: THREE.Vector3) => void, moveInput?: { x: number, z: number } }) => {
  const { camera } = useThree();
  const [, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 10, 0],
    args: [0.6],
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  const pos = useRef([0, 0, 0]);
  useEffect(() => api.position.subscribe((p) => (pos.current = p)), [api.position]);

  const [, getKeys] = useKeyboardControls();

  useFrame((state) => {
    const { forward, backward, left, right, jump } = getKeys();

    const direction = new THREE.Vector3();
    
    // Merge keyboard and touch input
    const moveX = (left ? 1 : 0) - (right ? 1 : 0) + (moveInput?.x || 0);
    const moveZ = (backward ? 1 : 0) - (forward ? 1 : 0) + (moveInput?.z || 0);
    
    const frontVector = new THREE.Vector3(0, 0, moveZ);
    const sideVector = new THREE.Vector3(moveX, 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(5)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], 4, velocity.current[2]);
    }

    camera.position.copy(new THREE.Vector3(pos.current[0], pos.current[1] + 1.6, pos.current[2]));
  });

  // Shooting logic (triggered by mouse click)
  useEffect(() => {
    const handleMouseDown = () => {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      const position = new THREE.Vector3(pos.current[0], pos.current[1] + 1.6, pos.current[2]);
      onShoot(position, direction);
    };
    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [camera, onShoot]);

  return (
    <mesh>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial color="orange" visible={false} />
    </mesh>
  );
};
