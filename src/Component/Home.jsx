import React, { useState, useEffect } from 'react';
import Onboarding2 from './Onboarding2';

const Home = () => {
  return (
    <div className="home_main_container">
      <div className="home_container">
        <div><img src="./Images/Voice Wave - Light.png" className="voiceWave" /></div>
        <div className="container">
          <div>
            <img src="./Images/Mic.png" />
          </div>
          <div className="home_texts">
            <h1>MED Scribe</h1>
            <div className="divider">
              <hr />
            </div>
            <p>Enhancing Patient Care</p>
            <p>Through Expert Staffing.</p>
          </div>
        </div>
        <div><img className="voiceWave1" src="./Images/Voice Wave - Light (1).png" /></div>
      <div className="mobile-voice-wave"><img src='../Images/Layer_1.png' /></div>
      <div className="voiceAnimation"><img style={{ width: '100%' }} src="../Images/voice animation.png" /></div>
      </div>
    </div>
  );
}

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOnboarding(true);
    },5000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <>
      {showOnboarding ? <Onboarding2 /> : <Home />}
    </>
  );
}

export default App;
