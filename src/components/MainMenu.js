// src/components/MainMenu.js
import React from 'react';
import './MainMenu.css'; // Importa los estilos

const MainMenu = () => {
  return (
    <div className="main-menu">
      <h1 className="title"> ________  _________  _______   ___       ___       ________  ________          ________  ________      ___    ___ ________   ________  _______       ___    ___ 
|\   ____\|\___   ___\\  ___ \ |\  \     |\  \     |\   __  \|\   __  \        |\   __  \|\   ___ \    |\  \  /  /|\   ____\ |\   ____\|\  ___ \     |\  \  /  /|
\ \  \___|\|___ \  \_\ \   __/|\ \  \    \ \  \    \ \  \|\  \ \  \|\  \       \ \  \|\  \ \  \_|\ \   \ \  \/  / | \  \___|_\ \  \___|\ \   __/|    \ \  \/  / /
 \ \_____  \   \ \  \ \ \  \_|/_\ \  \    \ \  \    \ \   __  \ \   _  _\       \ \  \\\  \ \  \ \\ \   \ \    / / \ \_____  \\ \_____  \ \  \_|/__   \ \    / / 
  \|____|\  \   \ \  \ \ \  \_|\ \ \  \____\ \  \____\ \  \ \  \ \  \\  \|       \ \  \\\  \ \  \_\\ \   \/  /  /   \|____|\  \\|____|\  \ \  \_|\ \   \/  /  /  
    ____\_\  \   \ \__\ \ \_______\ \_______\ \_______\ \__\ \__\ \__\\ _\        \ \_______\ \_______\__/  / /       ____\_\  \ ____\_\  \ \_______\__/  / /    
   |\_________\   \|__|  \|_______|\|_______|\|_______|\|__|\|__|\|__|\|__|        \|_______|\|_______|\___/ /       |\_________\\_________\|_______|\___/ /     
   \|_________|                                                                                       \|___|/        \|_________\|_________|        \|___|/      
                                                                                                                                                                 
                                                                                                                                                                 </h1>
      <div className="menu-options">
        <button className="menu-button">Start Journey</button>
      </div>
    </div>
  );
};

export default MainMenu;
