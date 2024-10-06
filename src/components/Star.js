import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Star = ({ scene, size = 1, position = { x: 0, y: 0, z: 0 }, intensity = 1 }) => {
  const starRef = useRef(null);

  useEffect(() => {
    // Crear la geometría de la estrella
    const starGeometry = new THREE.SphereGeometry(size, 32, 32);

    // Crear un material con brillo (emissive)
    const starMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff, // Color blanco
      emissive: 0xffffff, // El color que emite la estrella
      emissiveIntensity: intensity, // Intensidad del brillo
    });

    // Crear la malla de la estrella
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);

    // Posicionar la estrella
    starMesh.position.set(position.x, position.y, position.z);

    // Añadir la estrella a la escena
    scene.add(starMesh);
    starRef.current = starMesh;

    return () => {
      scene.remove(starMesh); // Limpiar al desmontar el componente
    };
  }, [scene, size, position, intensity]);

  return null;
};

export default Star;