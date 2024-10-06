import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as d3 from "d3";
import Exoplanet from "./Exoplanet";
import star_texture from "../textures/star_texture.png";
import Sun from "./Sun";

const StarField = () => {
  const mountRef = useRef(null);
  const sliderRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 1000;

    // Add OrbitControls for mouse-based camera control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable damping (inertia)
    controls.dampingFactor = 0.25; // Damping factor
    controls.enableZoom = false; // Disable zooming

    // Add event listener for mouse wheel
    const handleWheel = (event) => {
      camera.position.z += event.deltaY * 0.5; // Adjust the zoom speed as needed
    };

    window.addEventListener("wheel", handleWheel);

    // Cargar datos de las estrellas
    d3.csv("/data/gaia_stars.csv")
      .then((data) => {
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];

        data.forEach((star) => {
          const ra = parseFloat(star.ra);
          const dec = parseFloat(star.dec);
          const parallax = parseFloat(star.parallax);

          const { x, y, z } = raDecToCartesian(ra, dec, parallax);
          starVertices.push(x, y, z);
        });

        starGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(starVertices, 3)
        );

        // Cargar textura
        const textureLoader = new THREE.TextureLoader();
        const starTexture = textureLoader.load(star_texture); // Cambia la ruta de la textura

        const starMaterial = new THREE.PointsMaterial({
          size: 0.3,
          sizeAttenuation: true,
          map: starTexture,
          alphaTest: 0.5, // Ajusta según sea necesario para hacer la textura más transparente
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(10, 10, 10);
        scene.add(light);

        // Animación del campo estelar
        const animateStars = () => {
          requestAnimationFrame(animateStars);
          //stars.rotation.y += 0.001;
          renderer.render(scene, camera);
        };

        animateStars();
      })
      .catch((error) => {
        console.error("Error al cargar el archivo CSV:", error);
      });

    // Animar la escena
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls
      renderer.render(scene, camera);
    };

    animate();

    // Añadir control de zoom con slider
    sliderRef.current.addEventListener("input", (event) => {
      const zoomLevel = event.target.value;
      camera.position.z = zoomLevel;
    });

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener("wheel", handleWheel);
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

      <Sun scene={sceneRef.current} />

      <Exoplanet
        scene={sceneRef.current}
        size={4}
        colors={[0x008000, 0x0000ff, 0xffffff]} // Verde, azul, blanco
        position={{ x: 0, y: 0, z: 0 }} // Posición inicial
        shouldRotate={true} // Rotación habilitada
        orbitRadius={25} // Radio medio de la órbita reducido
        orbitSpeed={0.01} // Velocidad de la órbita
        inclination={0.4} // Inclinación en radianes (~23 grados)
        eccentricity={0.0167} // Excentricidad (similar a la Tierra)
      />
      <Exoplanet
        scene={sceneRef.current}
        size={4}
        colors={[0xff0000, 0xfffacd]} // Rojo, amarillo crema
        position={{ x: 0, y: 0, z: 0 }} // Posición inicial
        shouldRotate={true} // Rotación habilitada
        orbitRadius={50} // Radio medio de la órbita reducido
        orbitSpeed={0.005} // Velocidad de la órbita
        inclination={0.1} // Inclinación en radianes (~6 grados)
        eccentricity={0.1} // Excentricidad (similar a Marte)
      />
      <Exoplanet
        scene={sceneRef.current}
        size={3}
        colors={[0x8b4513, 0xffd700]} // Café, dorado
        position={{ x: 0, y: 0, z: 0 }} // Posición inicial
        shouldRotate={true} // Rotación habilitada
        orbitRadius={70} // Radio medio de la órbita reducido
        orbitSpeed={0.002} // Velocidad de la órbita
        inclination={0.3} // Inclinación en radianes (~17 grados)
        eccentricity={0.2} // Excentricidad (similar a Venus)
      />
      <Exoplanet
        scene={sceneRef.current}
        size={3}
        colors={[0x00ffff, 0x0000ff]} // Cian, azul
        position={{ x: 0, y: 0, z: 0 }} // Posición inicial
        shouldRotate={true} // Rotación habilitada
        orbitRadius={80} // Radio medio de la órbita reducido
        orbitSpeed={0.001} // Velocidad de la órbita
        inclination={0.2} // Inclinación en radianes (~11 grados)
        eccentricity={0.3} // Excentricidad (similar a Mercurio)
      />
      <Exoplanet
        scene={sceneRef.current}
        size={3}
        colors={[0x9932cc, 0xff69b4]} // Violeta, rosa
        position={{ x: 0, y: 0, z: 0 }} // Posición inicial
        shouldRotate={true} // Rotación habilitada
        orbitRadius={100} // Radio medio de la órbita reducido
        orbitSpeed={0.0005} // Velocidad de la órbita
        inclination={0.5} // Inclinación en radianes (~29 grados)
        eccentricity={0.4} // Excentricidad (similar a la Luna)
      />
      <Exoplanet
        scene={sceneRef.current}
        size={12} // Adjusted size for Saturn relative to the Sun
        colors={[0xd2b48c, 0xffe4b5, 0xffd700]} // Tan, Navajo White, Gold
        position={{ x: 0, y: 0, z: 0 }} // Initial position
        shouldRotate={true} // Enable rotation
        orbitRadius={100} // Adjusted orbit radius for Saturn
        orbitSpeed={0.0002} // Adjusted orbit speed for Saturn
        inclination={0.05} // Inclination in radians (~2.5 degrees)
        eccentricity={0.056} // Eccentricity similar to Saturn
      />
      <Exoplanet
        scene={sceneRef.current}
        size={12} // Adjusted size for Jupiter relative to the Sun
        colors={[0xffa500, 0xffd700, 0xff4500]} // Orange, Gold, Red-Orange
        position={{ x: 0, y: 0, z: 0 }} // Initial position
        shouldRotate={true} // Enable rotation
        orbitRadius={120} // Adjusted orbit radius for Jupiter
        orbitSpeed={0.0008} // Adjusted orbit speed for Jupiter
        inclination={0.05} // Inclination in radians (~3 degrees)
        eccentricity={0.048} // Eccentricity similar to Jupiter
      />
      <Exoplanet
        scene={sceneRef.current}
        size={0.3}
        colors={[0x8b4513, 0xffd700]} // Café, dorado
        position={{ x: 0, y: 0, z: 0 }} // Initial position
        shouldRotate={true} // Rotación habilitada
        orbitRadius={180} // Radio medio de la órbita reducido
        orbitSpeed={0.002} // Velocidad de la órbita
        inclination={0.3} // Inclinación en radianes (~17 grados)
        eccentricity={0.2} // Excentricidad (similar a Venus)
      />
      <Exoplanet
        scene={sceneRef.current}
        size={0.2}
        colors={[0x00ffff, 0x0000ff]} // Cian, azul
        position={{ x: 0, y: 0, z: 0 }} // Initial position
        shouldRotate={true} // Rotación habilitada
        orbitRadius={200} // Radio medio de la órbita reducido
        orbitSpeed={0.001} // Velocidad de la órbita
        inclination={0.2} // Inclinación en radianes (~11 grados)
        eccentricity={0.3} // Excentricidad (similar a Mercurio)
      />
      <Exoplanet
        scene={sceneRef.current}
        size={0.1}
        colors={[0x9932cc, 0xff69b4]} // Violeta, rosa
        position={{ x: 0, y: 0, z: 0 }} // Initial position
        shouldRotate={true} // Rotación habilitada
        orbitRadius={220} // Radio medio de la órbita reducido
        orbitSpeed={0.0005} // Velocidad de la órbita
        inclination={0.5} // Inclinación en radianes (~29 grados)
        eccentricity={0.4} // Excentricidad (similar a la Luna)
      />
    </div>
  );
};

export default StarField;