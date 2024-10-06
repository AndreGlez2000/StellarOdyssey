import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as d3 from "d3";
import Exoplanet from "./Exoplanet";
import star_texture from "../textures/star_texture.png";
import SolarSystem from "./SolarSystem";

const StarField = () => {
  const mountRef = useRef(null);
  const sliderRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar la visibilidad del menú
  const [ssystemVisible, setSSystemVisible] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState(""); // Estado para almacenar el planeta seleccionado
  const [exoplanets, setExoplanets] = useState([]);


  useEffect(() => {
    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    camera.position.z = 250;
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;


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
          starVertices.push(x,y,z);
        });

        starGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(starVertices,3)
        );

        const textureLoader = new THREE.TextureLoader();
        const starTexture = textureLoader.load(star_texture);

        const starMaterial = new THREE.PointsMaterial({
          size: 0.3,
          sizeAttenuation: true,
          map: starTexture,
          alphaTest: 0.5,
        })

        const stars = new THREE.Points(starGeometry,starMaterial);
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

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene,camera);
    };

    animate();

    // Añadir control de zoom con slider
    sliderRef.current.addEventListener("input", event => {
      const zoomLevel = event.target.value;
      camera.fov = zoomLevel;
      camera.updateProjectionMatrix();
    });

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const handleButtonClick = (planet) => {
    setSelectedPlanet(planet);
    setMenuVisible(true);
    setSSystemVisible(false);
    
    if (cameraRef.current) {
      cameraRef.current.position.set(5, 5, 5); // Cambia la posición de la cámara
      //cameraRef.current.lookAt(0, 0, 0); // Apuntar hacia el origen
    }

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

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function reverseString(str)
  {
    return str.split('').reverse().join('');
  }

  const stringToColour = (str) => {
    let hash = 0;
    str.split('').forEach(char=> {
      hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for(let i = 0;i<3;i++){
      const value = (hash >> (i * 8)) & 0xff
      colour += value.toString(16).padStart(2,'0')
    }
    return colour
  }

  function getFirstHalf(word) {
    const halfLength = Math.floor(word.length / 2); // Redondea hacia abajo si la longitud es impar
    return word.substring(0, halfLength);
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
              setSSystemVisible(true);
              if (cameraRef.current) {
                cameraRef.current.position.set(150, 150, 150); // Cambia la posición de la cámara
                //cameraRef.current.lookAt(0, 0, 0); // Apuntar hacia el origen
              }
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
      {ssystemVisible && <SolarSystem scene={sceneRef.current} />}
      {!ssystemVisible && 
            <Exoplanet
            scene={sceneRef.current}
            size={1.5}
            colors={
              [stringToColour(selectedPlanet.pl_name),
                stringToColour(reverseString(selectedPlanet.pl_name)),
                stringToColour(getFirstHalf(selectedPlanet.pl_name))
              ]} // Amarillo, naranja
            position={{ x: 0, y: 0, z: 0 }} // Posición del Sol (no orbita)
            shouldRotate={true} // Rotación habilitada
            orbitRadius={0} // Sin órbita (el Sol está en el centro)
            orbitSpeed={0} // Sin movimiento orbital
          />
      }
    </div>
  );
};

export default StarField;
