// src/components/StarField.js
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as d3 from "d3";

const StarField = () => {
  const mountRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Configuración básica de la escena Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Crear una esfera que represente la Tierra
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);  // Esfera de radio 1, con 32 segmentos

    // Generar colores aleatorios (verde, azul, blanco) para cada vértice de la esfera
    const colors = [];
    const color = new THREE.Color();
    
    // Recorre cada vértice de la esfera y asigna un color aleatorio entre verde, azul y blanco
    for (let i = 0; i < earthGeometry.attributes.position.count; i++) {
      const randomColor = Math.random();
      if (randomColor < 0.33) {
        color.set(0x008000);  // Verde (tierra)
      } else if (randomColor < 0.66) {
        color.set(0x0000ff);  // Azul (océano)
      } else {
        color.set(0xffffff);  // Blanco (nubes/hielo)
      }
      colors.push(color.r, color.g, color.b);
    }

    earthGeometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    );

    // Aplicar material que soporte vértices de colores
    const earthMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });  
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);  // Crear la malla de la esfera con los colores
    scene.add(earth);  // Añadir la Tierra a la escena

    camera.position.z = 5;  // Alejar la cámara para ver la Tierra

    // Cargar los datos estelares y procesarlos
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

        // Función de animación para el campo estelar
        const animateStars = () => {
          requestAnimationFrame(animateStars);
          stars.rotation.y += 0.001;  // Rotar suavemente el campo estelar
          renderer.render(scene, camera);
        };

        animateStars();
      })
      .catch(error => {
        // Manejo de errores si la carga falla
        console.error("Error al cargar el archivo CSV:", error);
      });

    // Animar la Tierra para que gire sobre su propio eje
    const animateEarth = () => {
      requestAnimationFrame(animateEarth);
      earth.rotation.y += 0.001;  // Rotar la Tierra en su eje Y (simula la rotación de la Tierra)
      renderer.render(scene, camera);
    };

    animateEarth();

    // Add event listener to slider
    sliderRef.current.addEventListener('input', (event) => {
      const zoomLevel = event.target.value;
      camera.position.z = zoomLevel;
    });

    // Limpiar el renderizador
    // return () => {
    //   mountRef.current.removeChild(renderer.domElement);
    // };
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

  return (
    <div>
      <div ref={mountRef} />
      <input
        ref={sliderRef}
        type="range"
        min="1"
        max="100"
        defaultValue="5"
        style={{ position: 'absolute', top: '10px', left: '10px' }}
      />
    </div>
  );
};

export default StarField;