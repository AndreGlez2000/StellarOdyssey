// src/components/StarField.js
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as d3 from "d3";
import Earth from "./Earth";
import Sun from "./Sun"; // Importa el componente Sun

const StarField = () => {
  const mountRef = useRef(null);
  const sliderRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene()); // Usar ref para la escena

  useEffect(() => {
    const scene = sceneRef.current; // Escena para todo
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Cargar datos de las estrellas
    d3.csv("/data/gaia_stars.csv")
      .then(data => {
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];

        data.forEach(star => {
          const ra = parseFloat(star.ra);
          const dec = parseFloat(star.dec);
          const parallax = parseFloat(star.parallax);

          const { x, y, z } = raDecToCartesian(ra, dec, parallax);
          starVertices.push(x, y, z);
        });

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Animación del campo estelar
        const animateStars = () => {
          requestAnimationFrame(animateStars);
          stars.rotation.y += 0.001; // Rotar suavemente
          renderer.render(scene, camera);
        };

        animateStars();
      })
      .catch(error => {
        console.error("Error al cargar el archivo CSV:", error);
      });

    // Animar la escena
    const animate = () => {
      requestAnimationFrame(animate);
      if (scene.children.length > 0) {
        scene.children[0].rotation.y += 0.001; // Rotación de la Tierra
        scene.children[1].rotation.y += 0.001; // Rotación del Sol
      }
      renderer.render(scene, camera);
    };

    animate();

    // Añadir control de zoom con slider
    sliderRef.current.addEventListener("input", event => {
      const zoomLevel = event.target.value;
      camera.position.z = zoomLevel;
    });

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  function raDecToCartesian(ra, dec, parallax) {
    const raRad = (ra * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;
    const distance = 1000 / parallax;

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
        style={{ position: "absolute", top: "10px", left: "10px" }}
      />
      <Earth scene={sceneRef.current} /> {/* Renderiza Earth */}
      <Sun scene={sceneRef.current} /> {/* Renderiza Sun */}
    </div>
  );
};

export default StarField;
