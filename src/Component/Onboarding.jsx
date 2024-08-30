import React from 'react';

const Onboarding = () => {
  return (
    <div className='onboarding-main-container'>
      <img src='./Images/Vector 3.png' alt='Top Background' className='vector-img' />
      <div className='onboarding_container'>
        <img src='./Images/girl_icon.png' alt='Girl Icon' />
        <div className='enhance-med'>
          <span>Enhancing</span>
          <h1>Workflow Efficiency</h1>
          <p>Scribes play a crucial role in optimizing healthcare delivery, enabling doctors to see more patients and improve overall productivity.</p>
          <button>Next</button>
        </div>
      </div>
      <div className='onboarding-dots'>
        <span className='active'></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Onboarding;
