import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as d3 from "d3";
import Exoplanet from "./Exoplanet";
import star_texture from "../textures/star_texture.png";

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

    camera.position.z = 5;

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

      <Exoplanet
        scene={sceneRef.current}
        size={10}
        colors={[0xffcc00, 0xff9900, 0xffdd00]} // Amarillo, naranja
        position={{ x: 0, y: 0, z: 0 }} // Posición del Sol (no orbita)
        shouldRotate={true} // Rotación habilitada
        orbitRadius={0} // Sin órbita (el Sol está en el centro)
        orbitSpeed={0} // Sin movimiento orbital
      />
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
        orbitRadius={6} // Radio medio de la órbita reducido
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
        orbitRadius={8} // Radio medio de la órbita reducido
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
        orbitRadius={10} // Radio medio de la órbita reducido
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
        orbitRadius={20} // Radio medio de la órbita reducido
        orbitSpeed={0.0005} // Velocidad de la órbita
        inclination={0.5} // Inclinación en radianes (~29 grados)
        eccentricity={0.4} // Excentricidad (similar a la Luna)
      />
      <Exoplanet
        scene={sceneRef.current}
        size={0.05}
        colors={[0x800080, 0xff1493]} // Púrpura, rosa intenso
        position={{ x: 0, y: 0, z: 0 }} // Posición inicial
        shouldRotate={true} // Rotación habilitada
        orbitRadius={30} // Radio medio de la órbita reducido
        orbitSpeed={0.0001} // Velocidad de la órbita
        inclination={0.6} // Inclinación en radianes (~34 grados)
        eccentricity={0.5} // Excentricidad (similar a Plutón)
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
        size={1}
        colors={[0x008000, 0x0000ff, 0xffffff]} // Verde, azul, blanco
        position={{ x: 0, y: 0, z: 0 }} // Posición inicial
        shouldRotate={true} // Rotación habilitada
        orbitRadius={4} // Radio medio de la órbita reducido
        orbitSpeed={0.01} // Velocidad de la órbita
        inclination={0.4} // Inclinación en radianes (~23 grados)
        eccentricity={0.0167} // Excentricidad (similar a la Tierra)
      />
      <Exoplanet
        scene={sceneRef.current}
        size={0.5}
        colors={[0xff0000, 0xfffacd]} // Rojo, amarillo crema
        position={{ x: 0, y: 0, z: 0 }} // Posición inicial
        shouldRotate={true} // Rotación habilitada
        orbitRadius={6} // Radio medio de la órbita reducido
        orbitSpeed={0.005} // Velocidad de la órbita
        inclination={0.1} // Inclinación en radianes (~6 grados)
        eccentricity={0.1} // Excentricidad (similar a Marte)
      />
      <Exoplanet
        scene={sceneRef.current}
        size={0.3}
        colors={[0x8b4513, 0xffd700]} // Café, dorado
        position={{ x: 0, y: 0, z: 0 }} // Posición inicial
        shouldRotate={true} // Rotación habilitada
        orbitRadius={10} // Radio medio de la órbita reducido
        orbitSpeed={0.002} // Velocidad de la órbita
        inclination={0.3} // Inclinación en radianes (~17 grados)
        eccentricity={0.2} // Excentricidad (similar a Venus)
      />
      <Exoplanet
        scene={sceneRef.current}
        size={0.2}
        colors={[0x00ffff, 0x0000ff]} // Cian, azul
        position={{ x: 0, y: 0, z: 0 }} // Posición inicial
        shouldRotate={true} // Rotación habilitada
        orbitRadius={15} // Radio medio de la órbita reducido
        orbitSpeed={0.001} // Velocidad de la órbita
        inclination={0.2} // Inclinación en radianes (~11 grados)
        eccentricity={0.3} // Excentricidad (similar a Mercurio)
      />
      <Exoplanet
        scene={sceneRef.current}
        size={0.1}
        colors={[0x9932cc, 0xff69b4]} // Violeta, rosa
        position={{ x: 0, y: 0, z: 0 }} // Posición inicial
        shouldRotate={true} // Rotación habilitada
        orbitRadius={20} // Radio medio de la órbita reducido
        orbitSpeed={0.0005} // Velocidad de la órbita
        inclination={0.5} // Inclinación en radianes (~29 grados)
        eccentricity={0.4} // Excentricidad (similar a la Luna)
      />
    </div>
  );
};

export default StarField;
