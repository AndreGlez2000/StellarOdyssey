// src/components/MainMenu.js
import React from 'react';
import './MainMenu.css'; // Importa los estilos

const MainMenu = () => {
  return (
    <div className="main-menu">
      <h1 className="title">Stellar Odyssey</h1>
      <div className="menu-options">
        <button className="menu-button">Start Journey</button>
      </div>
    </div>
  );
};

export default MainMenu;
