// src/components/Earth.js
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Earth = ({ scene }) => {
  const earthRef = useRef(null);

  useEffect(() => {
    // Crear una esfera que represente la Tierra
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32); // Esfera de radio 1, con 32 segmentos

    // Generar colores aleatorios (verde, azul, blanco) para cada vértice de la esfera
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < earthGeometry.attributes.position.count; i++) {
      const randomColor = Math.random();
      if (randomColor < 0.33) {
        color.set(0x008000); // Verde (tierra)
      } else if (randomColor < 0.66) {
        color.set(0x0000ff); // Azul (océano)
      } else {
        color.set(0xffffff); // Blanco (nubes/hielo)
      }
      colors.push(color.r, color.g, color.b);
    }

    earthGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    // Aplicar material que soporte vértices de colores
    const earthMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

    scene.add(earthMesh); // Añadir la Tierra a la escena
    earthRef.current = earthMesh;

    return () => {
      scene.remove(earthMesh); // Limpiar al desmontar
    };
  }, [scene]);

  return null;
};

export default Earth;
