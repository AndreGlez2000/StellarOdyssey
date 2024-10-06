import React from "react";
import Sun from "./Sun";
import Exoplanet from "./Exoplanet";

const SolarSystem = ({ scene }) => {
  return (
    <>
      <Sun scene={scene} />

      <Exoplanet
        scene={scene}
        size={4}
        colors={[0x008000, 0x0000ff, 0xffffff]} // Verde, azul, blanco
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={40}
        orbitSpeed={0.01}
      />
      <Exoplanet
        scene={scene}
        size={4}
        colors={[0xff0000, 0xfffacd]} // Rojo, amarillo crema
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={60}
        orbitSpeed={0.005}
      />
      <Exoplanet
        scene={scene}
        size={3}
        colors={[0x8b4513, 0xffd700]} // Café, dorado
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={45}
        orbitSpeed={0.002}
      />
      <Exoplanet
        scene={scene}
        size={3}
        colors={[0x00ffff, 0x0000ff]} // Cian, azul
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={25}
        orbitSpeed={0.001}
      />
      <Exoplanet
        scene={scene}
        size={12} // Adjusted size for Saturn relative to the Sun
        colors={[0xd2b48c, 0xffe4b5, 0xffd700]} // Tan, Navajo White, Gold
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={120}
        orbitSpeed={0.0002}
      />
      <Exoplanet
        scene={scene}
        size={12} // Adjusted size for Jupiter relative to the Sun
        colors={[0xFFFACD, 0x6F4E37, 0xFFFFE0]} // Mayonesa, Café, Poco Amarillo
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={90}
        orbitSpeed={0.0008}
      />
      <Exoplanet
        scene={scene}
        size={6} // Adjusted size for Uranus relative to the Sun
        colors={[0x4682B4, 0x87CEEB, 0x00BFFF]} // Acero Azul, Cielo Azul Claro, Azul Real
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={150}
        orbitSpeed={0.0001}

      />
      <Exoplanet
        scene={scene}
        size={6} // Adjusted size for Neptune relative to the Sun
        colors={[0x00008B, 0x4169E1, 0x0000FF]} // Azul Oscuro, Azul Real, Azul
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={180}
        orbitSpeed={0.0001}
      />
    </>
  );
};

export default SolarSystem;