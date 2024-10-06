import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as d3 from "d3";
import SolarSystem from "./SolarSystem"; // Import the new SolarSystem component
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

    // Asegúrate de que mountRef.current esté disponible
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    camera.position.z = 250;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    const handleWheel = (event) => {
      camera.position.z += event.deltaY * 0.5;
    };

    window.addEventListener("wheel", handleWheel);

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

        const textureLoader = new THREE.TextureLoader();
        const starTexture = textureLoader.load(star_texture);

        const starMaterial = new THREE.PointsMaterial({
          size: 0.3,
          sizeAttenuation: true,
          map: starTexture,
          alphaTest: 0.5,
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        const light = new THREE.PointLight(0xffffff, 1, 100);
        

        const animateStars = () => {
          requestAnimationFrame(animateStars);
          renderer.render(scene, camera);
        };

        animateStars();
      })
      .catch((error) => {
        console.error("Error al cargar el archivo CSV:", error);
      });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    sliderRef.current.addEventListener("input", (event) => {
      const zoomLevel = event.target.value;
      camera.position.z = zoomLevel;
    });

    return () => {
      // Asegúrate de que mountRef.current no sea null antes de remover el domElement
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
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

      <SolarSystem scene={sceneRef.current} /> {/* Render the SolarSystem component */}
    </div>
  );
};

export default StarField;
