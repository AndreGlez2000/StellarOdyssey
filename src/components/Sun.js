// src/components/Sun.js
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Sun = ({ scene }) => {
  const sunRef = useRef(null);

  useEffect(() => {
    // Crear una esfera que represente el Sol
    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32); // Esfera de radio 1.5, con 32 segmentos

    // Generar colores aleatorios (amarillo y naranja) para cada vértice de la esfera
    const colors = [];
    const color = new THREE.Color();
    
    // Recorre cada vértice de la esfera y asigna un color aleatorio entre amarillo y naranja
    for (let i = 0; i < sunGeometry.attributes.position.count; i++) {
      const randomColor = Math.random();
      if (randomColor < 0.5) {
        color.set(0xffcc00); // Amarillo
      } else {
        color.set(0xff9900); // Naranja
      }
      colors.push(color.r, color.g, color.b);
    }

    sunGeometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    );

    // Aplicar material que soporte vértices de colores, asegurándose de que sea opaco
    const sunMaterial = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: false });  
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(3, 0, 0); // Posiciona el Sol a la derecha de la Tierra

    scene.add(sunMesh); // Añadir el Sol a la escena
    sunRef.current = sunMesh;

    // Función de animación para girar el Sol
    const animateSun = () => {
      requestAnimationFrame(animateSun);
      sunMesh.rotation.y += 0.01; // Rota el Sol sobre su eje Y
    };

    animateSun(); // Inicia la animación

    return () => {
      scene.remove(sunMesh); // Limpiar al desmontar
    };
  }, [scene]);

  return null;
};

export default Sun;
