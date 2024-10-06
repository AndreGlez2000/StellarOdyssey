import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as d3 from "d3";
import Exoplanet from "./Exoplanet";

// Importar módulos para post-procesamiento
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


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
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Configurar EffectComposer y BloomPass
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      2.5, // Intensidad del bloom (ajustada para mayor efecto)
      0.5, // Radio del bloom (ajustado para mayor desenfoque)
      0.0  // Umbral del bloom (reducido para afectar más áreas)
    );
    composer.addPass(bloomPass);

    // Cargar datos de las estrellas
    d3.csv("/data/gaia_stars.csv")
      .then((data) => {
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        const sizes = [];
        const colors = [];
        const haloSizes = [];
        const alphas = [];

        const minSize = 0.5;
        const maxSize = 1.5;

        data.forEach((star) => {
          const ra = parseFloat(star.ra);
          const dec = parseFloat(star.dec);
          const parallax = parseFloat(star.parallax);

          const { x, y, z } = raDecToCartesian(ra, dec, parallax);
          starVertices.push(x, y, z);

          // Tamaño aleatorio de la estrella
          const size = Math.random() * (maxSize - minSize) + minSize;
          sizes.push(size);

          // Tamaño aleatorio del halo
          const haloSize = Math.random() * (1.2 - 0.8) + 0.8;
          haloSizes.push(haloSize);

          // Transparencia aleatoria
          const alpha = Math.random() * (1.0 - 0.5) + 0.5;
          alphas.push(alpha);

          // Color fijo (blanco)
          const color = new THREE.Color(0xffffff);
          colors.push(color.r, color.g, color.b);
        });

        starGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(starVertices, 3)
        );
        starGeometry.setAttribute(
          "size",
          new THREE.Float32BufferAttribute(sizes, 1)
        );
        starGeometry.setAttribute(
          "haloSize",
          new THREE.Float32BufferAttribute(haloSizes, 1)
        );
        starGeometry.setAttribute(
          "alpha",
          new THREE.Float32BufferAttribute(alphas, 1)
        );
        starGeometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(colors, 3)
        );

        // Shader Material personalizado
        const starMaterial = new THREE.ShaderMaterial({
          uniforms: {},
          vertexShader: `
            attribute float size;
            attribute float haloSize;
            attribute float alpha;
            varying vec3 vColor;
            varying float vHaloSize;
            varying float vAlpha;

            void main() {
              vColor = color;
              vHaloSize = haloSize;
              vAlpha = alpha;
              vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
              gl_PointSize = size * ( 300.0 / -mvPosition.z );
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            varying float vHaloSize;
            varying float vAlpha;

            void main() {
              vec2 coord = gl_PointCoord - vec2(0.5);
              float dist = length(coord) * 2.0 / vHaloSize;

              // Núcleo sólido
              float core = smoothstep(0.0, 0.3, 1.0 - dist);

              // Capa exterior desvanecida
              float halo = smoothstep(0.3, 1.0, 1.0 - dist);

              // Alpha combinado con transparencia individual
              float alpha = (core + (halo * 0.5)) * vAlpha;

              if (alpha <= 0.0) discard;

              gl_FragColor = vec4(vColor, alpha);
            }
          `,
          blending: THREE.AdditiveBlending,
          depthTest: true,
          depthWrite: false,
          transparent: true,
          vertexColors: true,
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Animación del campo estelar
        const animateStars = () => {
          requestAnimationFrame(animateStars);
          // Puedes agregar animaciones adicionales aquí si lo deseas
        };

        animateStars();
      })
      .catch((error) => {
        console.error("Error al cargar el archivo CSV:", error);
      });

    // Animar la escena
    const animate = () => {
      requestAnimationFrame(animate);
      composer.render();
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
