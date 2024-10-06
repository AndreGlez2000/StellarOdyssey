import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as d3 from "d3";
import Exoplanet from "./Exoplanet";
import star_texture from "../textures/star_texture.png";

const StarField = () => {
  const mountRef = useRef(null);
  const sliderRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar la visibilidad del menú
  const [selectedPlanet, setSelectedPlanet] = useState(""); // Estado para almacenar el planeta seleccionado
  const [exoplanets, setExoplanets] = useState([]);


  useEffect(() => {
    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;

    d3.csv("/data/PS_2024.10.05_15.14.56.csv").then(data => {
      setExoplanets(data);
    }).catch(error => {
      console.error("Error al cargar el archivo csv: ",error);
    });

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
        const starTexture = textureLoader.load(star_texture);

        const starMaterial = new THREE.PointsMaterial({
          size: 0.3,
          sizeAttenuation: true,
          map: starTexture,
          alphaTest: 0.5
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Animación del campo estelar
        const animateStars = () => {
          requestAnimationFrame(animateStars);
          renderer.render(scene, camera);
        };

        animateStars();
      })
      .catch(error => {
        console.error("Error al cargar el archivo CSV:", error);
      });

    // Añadir control de zoom con slider
    sliderRef.current.addEventListener("input", event => {
      const zoomLevel = event.target.value;
      camera.position.z = zoomLevel;
    });

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const handleButtonClick = (planet) => {
    setSelectedPlanet(planet);
    setMenuVisible(true);
    console.log('Boton ${planet.name} clicado');
  };

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
      <div
        id="Menu"
        style={{
          position: "absolute",
          height: "200px",
          overflowX: "hidden",
          overflowY: "scroll",
          top: "30px",
          left: "10px",
          backgroundColor: "#333",
          color: "white",
          padding: "20 px 10px 10px 10px",
          borderRadius: "5px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {exoplanets.map((planet, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(planet)}
            style={{
              marginBottom: "5px", // Espacio entre los botones
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {planet.pl_name}
          </button>
        ))}
      </div>

      {/* Mostrar el menú si está visible */}
      {menuVisible && (
        <div
          style={{
            position: "absolute",
            top: "200px",
            left: "275px",
            width: "275px",
            backgroundColor: "#000",
            color: "white",
            padding: "10px",
            borderStyle: "solid",
            borderColor: "white",
            borderRadius: "5px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
            textAlign: "justify",
            textJustify: "inter-word",
            hyphens: "auto",
            fontSize: "small",
            lineHeight: "0.8",
            margin: "0"
          }}
        >
          <h1>{selectedPlanet.pl_name}</h1>
          <p>System name: {selectedPlanet.hostname}</p>
          <p>Discovery method: {selectedPlanet.discoverymethod}</p>
          <p>Year: {selectedPlanet.disc_year}</p>
          <p>Orbit(days): {selectedPlanet.pl_orbper}</p>
          <p>Radius(earth): {selectedPlanet.pl_rade}</p>
          <p>RA: {selectedPlanet.rastr}</p>
          <p>RA(deg): {selectedPlanet.ra}</p>
          <p>Dec: {selectedPlanet.decstr}</p>
          <p>Dec(deg): {selectedPlanet.dec}</p>
          <p>Distance(pc): {selectedPlanet.sy_dist}</p>
          <button 
            onClick={() => {
              setMenuVisible(false); // Cerrar menú
              console.log("Menú cerrado"); // Log para depuración
            }}
            style={{
              backgroundColor: "#f44336", // Rojo
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cerrar Menú
          </button>
        </div>
      )}

      {/* Crear y renderizar planetas usando el componente Exoplanet */}
      <Exoplanet
        scene={sceneRef.current}
        size={1}
        colors={[0x008000, 0x0000ff, 0xffffff]} // Verde, azul, blanco
        position={{ x: 0, y: 0, z: 0 }} // Posición inicial
        shouldRotate={true} // Rotación habilitada
        orbitRadius={3} // Radio de la órbita
        orbitSpeed={0.01} // Velocidad de la órbita
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
    </div>
  );
};

export default StarField;
