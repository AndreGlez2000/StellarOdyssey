// src/components/Exoplanet.js
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Exoplanet = ({ scene, size, colors, position, rotationSpeed }) => {
  const planetRef = useRef(null);

  useEffect(() => {
    // Crear una esfera que represente el exoplaneta
    const geometry = new THREE.SphereGeometry(size, 32, 32); // Tamaño basado en el prop 'size'

    // Generar colores aleatorios para cada vértice de la esfera
    const colorArray = [];
    const color = new THREE.Color();

    // Asigna colores aleatorios basados en el array de colores proporcionado
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      const randomColor = Math.random();
      const selectedColor = randomColor < 0.5 ? colors[0] : colors[1]; // Escoge entre los dos colores
      color.set(selectedColor);
      colorArray.push(color.r, color.g, color.b);
    }

    geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colorArray, 3)
    );

    // Aplicar material que soporte vértices de colores
    const material = new THREE.MeshBasicMaterial({ vertexColors: true });
    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.position.set(...position); // Usa la posición proporcionada

    planetRef.current = planetMesh;

    // Añadir el exoplaneta a la escena
    scene.add(planetMesh);

    // Función de animación para girar el exoplaneta
    const animatePlanet = () => {
      requestAnimationFrame(animatePlanet);
      planetMesh.rotation.y += rotationSpeed; // Rota el exoplaneta según 'rotationSpeed'
    };

    animatePlanet();

    return () => {
      scene.remove(planetMesh); // Limpiar al desmontar
    };
  }, [scene, size, colors, position, rotationSpeed]);

  return null; // Este componente no devuelve nada
};

export default Exoplanet;
