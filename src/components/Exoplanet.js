import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Exoplanet = ({ scene, size, colors, position, shouldRotate, orbitRadius, orbitSpeed, inclination = 0, eccentricity = 0 }) => {
  const planetRef = useRef(null);
  let angle = 0; // Ángulo inicial para la órbita

  useEffect(() => {
    // Crear una esfera que represente el planeta
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32); // Esfera del tamaño pasado por props

    // Generar colores personalizados para cada vértice de la esfera
    const planetColors = [];
    const color = new THREE.Color();

    for (let i = 0; i < planetGeometry.attributes.position.count; i++) {
      const randomColor = Math.random();
      if (randomColor < 0.33) {
        color.set(colors[0]); // Primer color (ej. tierra)
      } else if (randomColor < 0.66) {
        color.set(colors[1]); // Segundo color (ej. océano)
      } else {
        color.set(colors[2]); // Tercer color (ej. nubes)
      }
      planetColors.push(color.r, color.g, color.b);
    }

    planetGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(planetColors, 3)
    );

    // Aplicar material que soporte vértices de colores
    const planetMaterial = new THREE.MeshBasicMaterial({ vertexColors: true, emissive: 0xffffff, emissiveIntensity: 0.5});
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

    // Posicionar el planeta en su posición inicial
    planetMesh.position.set(position.x, position.y, position.z);

    scene.add(planetMesh); // Añadir el planeta a la escena
    planetRef.current = planetMesh;

    // Función de animación para rotar y orbitar el planeta
    const animatePlanet = () => {
      if (shouldRotate) {
        planetMesh.rotation.y += 0.01; // Rota el planeta sobre su eje Y
      }

      // Actualizar el ángulo para la órbita
      angle += orbitSpeed;

      // Cálculos de la órbita con excentricidad e inclinación
      const semiMajorAxis = orbitRadius * (1 + eccentricity);
      const semiMinorAxis = orbitRadius * (1 - eccentricity);

      const x = semiMajorAxis * Math.cos(angle);
      const z = semiMinorAxis * Math.sin(angle);

      // Aplicar la inclinación orbital
      const y = z * Math.sin(inclination); // Ajuste del eje Y por inclinación
      const adjustedZ = z * Math.cos(inclination);

      // Mover el planeta en su órbita ajustada
      planetMesh.position.set(x, y, adjustedZ);

      requestAnimationFrame(animatePlanet); // Continuar la animación
    };

    animatePlanet(); // Iniciar la animación

    return () => {
      scene.remove(planetMesh); // Limpiar al desmontar
    };
  }, [scene, size, colors, position, shouldRotate, orbitRadius, orbitSpeed, inclination, eccentricity]);

  return null;
};

export default Exoplanet;
