// src/components/StarField.js
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as d3 from "d3";
import Exoplanet from "./Exoplanet";

const StarField = () => {
  const mountRef = useRef(null);
  const sliderRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());

  useEffect(() => {
    const scene = sceneRef.current;
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
          stars.rotation.y += 0.001;
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
      
      {/* Crear y renderizar planetas usando el componente Exoplanet */}
      <Exoplanet
        scene={sceneRef.current}
        size={1}
        colors={[0x008000, 0x0000ff, 0xffffff]} // Verde, azul, blanco
        position={{ x: 0, y: 0, z: 0 }} // Posición de la Tierra
        shouldRotate={true} // Rotación habilitada
      />
      <Exoplanet
        scene={sceneRef.current}
        size={1.5}
        colors={[0xffcc00, 0xff9900, 0xffdd00]} // Amarillo, naranja
        position={{ x: 3, y: 0, z: 0 }} // Posición del Sol
        shouldRotate={true} // Rotación habilitada para el Sol
      />
      {/* Añadir más planetas si es necesario */}
    </div>
  );
};

export default StarField;
