// src/components/WelcomePage.js
import "./WelcomePage.css";

const WelcomePage = ({ setShowExoplanets }) => {
  return (
    <div className="welcome-page">
      <h1>Welcome to the Exosky!</h1>
      <button onClick={() => setShowExoplanets(true)}>Start</button>
    </div>
  );
};

export default WelcomePage;