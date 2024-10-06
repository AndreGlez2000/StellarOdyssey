import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as d3 from "d3";
import Exoplanet from "./Exoplanet";

import star_texture from "../textures/star_texture.png";

const StarField = () => {
  const mountRef = useRef(null);
  const sliderRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());

  const cameraRef = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Cargar datos de las estrellas
    d3.csv("/data/gaia_stars.csv")
      .then(data => {
        const planeGeometry = new THREE.PlaneGeometry(1, 1); // Crear geometría de plano
        
        data.forEach(star => {
          const ra = parseFloat(star.ra);
          const dec = parseFloat(star.dec);
          const parallax = parseFloat(star.parallax);
          const { x, y, z } = raDecToCartesian(ra, dec, parallax);

          // Cargar textura
          const textureLoader = new THREE.TextureLoader();
          const starTexture = textureLoader.load(star_texture); // Cambia la ruta de la textura

          const starMaterial = new THREE.MeshBasicMaterial({ 
            size: 0.3, 
            sizeAttenuation: true,
            map: starTexture,
            alphaTest: 0.5 // Ajusta según sea necesario para hacer la textura más transparente
          });

          const starMesh = new THREE.Mesh(planeGeometry, starMaterial);
          starMesh.position.set(x, y, z);
          //starMesh.loookAt(0, 0, 0); // Asegurarse de que el plano esté orientado correctamente
          scene.add(starMesh);
        });

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

    var targetRef = new THREE.Vector3(0, 0, 0);
    // Añadir evento de clic
    const onClick = (event) => {
      // Convertir coordenadas del mouse a el espacio de normalizado
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Actualizar el raycaster
      raycaster.current.setFromCamera(mouse.current, camera);

      // Calcular objetos interseccionados
      const intersects = raycaster.current.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const starPosition = intersects[0].point;
        camera.position.set(starPosition.x, starPosition.y, starPosition.z + 5); // Mover la cámara a la posición de la estrella
        targetRef = starPosition;
        //camera.lookAt(starPosition); // Hacer que la cámara mire hacia la estrella
      }
    };

    // Añadir el listener para el clic
    renderer.domElement.addEventListener("click", onClick);

    // Animar la escena
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
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
        min="30"
        max="178"
        defaultValue="75"
        style={{ position: "absolute", top: "10px", left: "10px" }}
      />
      
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
