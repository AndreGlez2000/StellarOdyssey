import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Sun = ({ scene }) => {
  const sunRef = useRef(null);

  useEffect(() => {
    // Predefined values for the sun
    const size = 20;
    const colors = [0xffd700, 0xffa500, 0xff4500]; // Gold, Orange, Red-Orange
    const position = { x: 0, y: 0, z: 0 };
    const shouldRotate = true;

    // Create a sphere to represent the sun
    const sunGeometry = new THREE.SphereGeometry(size, 32, 32);

    // Generate custom colors for each vertex of the sphere
    const sunColors = [];
    const color = new THREE.Color();

    for (let i = 0; i < sunGeometry.attributes.position.count; i++) {
      const randomColor = Math.random();
      if (randomColor < 0.33) {
        color.set(colors[0]); // First color (e.g., gold)
      } else if (randomColor < 0.66) {
        color.set(colors[1]); // Second color (e.g., orange)
      } else {
        color.set(colors[2]); // Third color (e.g., red-orange)
      }
      sunColors.push(color.r, color.g, color.b);
    }

    sunGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(sunColors, 3)
    );

    // Apply material that supports vertex colors
    const sunMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

    // Position the sun at its initial position
    sunMesh.position.set(position.x, position.y, position.z);

    scene.add(sunMesh); // Add the sun to the scene
    sunRef.current = sunMesh;

    // Add a light source to the scene
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Animation function to rotate the sun
    const animateSun = () => {
      if (shouldRotate) {
        sunMesh.rotation.y += 0.01; // Rotate the sun around its Y axis
      }

      requestAnimationFrame(animateSun); // Continue the animation
    };

    animateSun(); // Start the animation

    return () => {
      scene.remove(sunMesh); // Clean up on unmount
      scene.remove(light); // Remove the light source
    };
  }, [scene]);

  return null;
};

export default Sun;