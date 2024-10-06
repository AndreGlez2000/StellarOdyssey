// src/components/StarField.js
import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import * as d3 from "d3";
import Exoplanet from "./Exoplanet";
import WelcomePage from "./welcomePage/WelcomePage";
import star_texture from "../textures/star_texture.png";

const StarField = () => {
  const mountRef = useRef(null);
  const sliderRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const [showExoplanets, setShowExoplanets] = useState(false);

  useEffect(() => {
    if (!showExoplanets) return;

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

        // Cargar textura
        const textureLoader = new THREE.TextureLoader();
        const starTexture = textureLoader.load(star_texture); // Cambia la ruta de la textura

        const starMaterial = new THREE.PointsMaterial({ 
          size: 0.3, 
          sizeAttenuation: true,
          map: starTexture,
          alphaTest: 0.5 // Ajusta según sea necesario para hacer la textura más transparente
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Animación del campo estelar
        const animateStars = () => {
          requestAnimationFrame(animateStars);
          //stars.rotation.y += 0.001;
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
  }, [showExoplanets]);

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
      {showExoplanets ? (
        <>
          <div ref={mountRef} />
          <input
            ref={sliderRef}
            type="range"
            min="1"
            max="100"
            defaultValue="5"
            style={{ position: "absolute", top: "10px", left: "10px" }}
          />
          <Exoplanet
            scene={sceneRef.current}
            size={1}
            colors={[0x008000, 0x0000ff, 0xffffff]}
            position={{ x: 0, y: 0, z: 0 }}
            shouldRotate={true}
            orbitRadius={3}
            orbitSpeed={0.01}
          />

          <Exoplanet
            scene={sceneRef.current}
            size={1.5}
            colors={[0xffcc00, 0xff9900, 0xffdd00]} // Amarillo, naranja
            position={{ x: 0, y: 0, z: 0 }} // Posición del Sol (no orbita)
            shouldRotate={true} // Rotación habilitada
            orbitRadius={0} // Sin órbita (el Sol está en el centro)
            orbitSpeed={0} // Sin movimiento orbital
          />

          <Exoplanet
            scene={sceneRef.current}
            size={0.5}
            colors={[0x9966ff, 0x0000ff, 0xffffff]} // Morado, azul, blanco
            position={{ x: 0, y: 0, z: 0 }} // Posición inicial
            shouldRotate={true} // Rotación habilitada
            orbitRadius={2} // Radio de la órbita
            orbitSpeed={0.02} // Velocidad de la órbita
          />
        </>
      ) : (
        <WelcomePage setShowExoplanets={setShowExoplanets} />
      )}
    </div>
  );
};

export default StarField;