import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import StarField from './components/StarField'; // Ejemplo de otro componente

function App() {
  const [inGame, setInGame] = useState(false);

  return (
    <div>
      {!inGame ? (
        <MainMenu />
      ) : (
        <StarField /> // Cambia a tu componente principal del juego
      )}
    </div>
  );
}

export default App;
