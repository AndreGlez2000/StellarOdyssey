// src/components/StarField.js
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as d3 from "d3";

const StarField = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Configuración básica de la escena Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Agregar manejo de errores en la carga del archivo CSV
    d3.csv("/data/gaia_stars.csv")
      .then(data => {
        console.log("Datos cargados correctamente:", data);

        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];

        // Procesar cada estrella en el archivo CSV
        data.forEach(star => {
          const ra = parseFloat(star.ra);
          const dec = parseFloat(star.dec);
          const parallax = parseFloat(star.parallax);

          // Convertir RA, Dec y paralaje a coordenadas cartesianas (x, y, z)
          const { x, y, z } = raDecToCartesian(ra, dec, parallax);
          starVertices.push(x, y, z);  // Agregar las coordenadas a la geometría
        });

        // Configurar la geometría y el material de las estrellas
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Función de animación
        const animate = () => {
          requestAnimationFrame(animate);
          stars.rotation.y += 0.001;  // Rotar suavemente el campo estelar
          renderer.render(scene, camera);
        };

        animate();
      })
      .catch(error => {
        // Manejo de errores si la carga falla
        console.error("Error al cargar el archivo CSV:", error);
      });

    // Agregar un cubo para verificar que Three.js funciona
    const geometry = new THREE.BoxGeometry(1, 1, 1);  // Geometría del cubo
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });  // Material verde
    const cube = new THREE.Mesh(geometry, material);  // Crear el cubo
    scene.add(cube);  // Añadir el cubo a la escena

    camera.position.z = 5;  // Alejar la cámara para ver el cubo

    // Animar el cubo
    const animateCube = () => {
      requestAnimationFrame(animateCube);
      cube.rotation.x += 0.01;  // Rotar el cubo en el eje X
      cube.rotation.y += 0.01;  // Rotar el cubo en el eje Y
      renderer.render(scene, camera);
    };

    animateCube();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // Función para convertir RA y Dec a coordenadas cartesianas (x, y, z)
  function raDecToCartesian(ra, dec, parallax) {
    const raRad = (ra * Math.PI) / 180;  // Convertir RA a radianes
    const decRad = (dec * Math.PI) / 180;  // Convertir Dec a radianes
    const distance = 1000 / parallax;  // Convertir la paralaje en distancia en parsecs

    const x = distance * Math.cos(raRad) * Math.cos(decRad);
    const y = distance * Math.sin(raRad) * Math.cos(decRad);
    const z = distance * Math.sin(decRad);

    return { x, y, z };
  }

  return <div ref={mountRef} />;
};

export default StarField;
