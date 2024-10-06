// src/components/WelcomePage.js
import "./WelcomePage.css";

const WelcomePage = ({ setShowExoplanets }) => {
  return (
    <div className="welcome-page">
      <h1>Welcome to the Exosky!</h1>
      <p>Probando.</p>
      <button onClick={() => setShowExoplanets(true)}>hola</button>
    </div>
  );
};

export default WelcomePage;