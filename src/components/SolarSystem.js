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
        inclination={0.4} // Inclinación en radianes (~23 grados)
        eccentricity={0.0167} // Excentricidad (similar a la Tierra)
      />
      <Exoplanet
        scene={scene}
        size={4}
        colors={[0xff0000, 0xfffacd]} // Rojo, amarillo crema
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={60}
        orbitSpeed={0.005}
        inclination={0.1} // Inclinación en radianes (~6 grados)
        eccentricity={0.1} // Excentricidad (similar a Marte)
      />
      <Exoplanet
        scene={scene}
        size={3}
        colors={[0x8b4513, 0xffd700]} // Café, dorado
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={45}
        orbitSpeed={0.002}
        inclination={0.3} // Inclinación en radianes (~17 grados)
        eccentricity={0.2} // Excentricidad (similar a Venus)
      />
      <Exoplanet
        scene={scene}
        size={3}
        colors={[0x00ffff, 0x0000ff]} // Cian, azul
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={25}
        orbitSpeed={0.001}
        inclination={0.2} // Inclinación en radianes (~11 grados)
        eccentricity={0.3} // Excentricidad (similar a Mercurio)
      />
      <Exoplanet
        scene={scene}
        size={12} // Adjusted size for Saturn relative to the Sun
        colors={[0xd2b48c, 0xffe4b5, 0xffd700]} // Tan, Navajo White, Gold
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={120}
        orbitSpeed={0.0002}
        inclination={0.05} // Inclination in radians (~2.5 degrees)
        eccentricity={0.056} // Eccentricity similar to Saturn
      />
      <Exoplanet
        scene={scene}
        size={12} // Adjusted size for Jupiter relative to the Sun
        colors={[0xFFFACD, 0x6F4E37, 0xFFFFE0]} // Mayonesa, Café, Poco Amarillo
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={90}
        orbitSpeed={0.0008}
        inclination={0.05} // Inclination in radians (~3 degrees)
        eccentricity={0.0048} // Eccentricity similar to Jupiter
      />
      <Exoplanet
        scene={scene}
        size={6} // Adjusted size for Uranus relative to the Sun
        colors={[0x4682B4, 0x87CEEB, 0x00BFFF]} // Acero Azul, Cielo Azul Claro, Azul Real
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={150}
        orbitSpeed={0.0001}
        inclination={0.05} // Inclination in radians (~3 degrees)
        eccentricity={0.0472} // Eccentricity similar to Uranus
      />
      <Exoplanet
        scene={scene}
        size={6} // Adjusted size for Neptune relative to the Sun
        colors={[0x00008B, 0x4169E1, 0x0000FF]} // Azul Oscuro, Azul Real, Azul
        position={{ x: 0, y: 0, z: 0 }}
        shouldRotate={true}
        orbitRadius={180}
        orbitSpeed={0.0001}
        inclination={0.05} // Inclination in radians (~3 degrees)
        eccentricity={0.0086} // Eccentricity similar to Neptune
      />
    </>
  );
};

export default SolarSystem;
