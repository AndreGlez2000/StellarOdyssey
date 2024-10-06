import React, { useState } from "react";
import StarField from "./components/StarField";
import WelcomePage from "./components/WelcomePage/WelcomePage";

function App() {
  const [showExoplanets, setShowExoplanets] = useState(false); // Controlar si mostrar WelcomePage o StarField
  
  return (
    <div className="App">
      {showExoplanets ? (
        <StarField /> // Mostrar StarField si showExoplanets es true
      ) : (
        <WelcomePage setShowExoplanets={setShowExoplanets} /> // Mostrar WelcomePage si showExoplanets es false
      )}
    </div>
  );
}

export default App;