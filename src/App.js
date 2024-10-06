import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import StarField from './components/StarField'; // Ejemplo de otro componente

function App() {
  const [inGame, setInGame] = useState(false);

  // Función para iniciar el juego
  const startGame = () => {
    setInGame(true); // Cambia el estado para iniciar el juego
  };

  return (
    <div>
      {!inGame ? (
        // Pasar la función startGame como prop a MainMenu
        <MainMenu onStart={startGame} />
      ) : (
        <StarField /> // Cambia a tu componente principal del juego
      )}
    </div>
  );
}

export default App;
