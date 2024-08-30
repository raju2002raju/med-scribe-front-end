import React, { useState } from 'react'
import {Link} from 'react-router-dom'

const Onboarding2 = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    setCurrentStep(prevStep => prevStep + 1)
  }

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div>
            <img src='./Images/Vector 3.png' style={{width:'100%'}} className='vector-img' />
            <div className="mobile-h1"><h1><span>Enhancing</span> Workflow Efficiency</h1></div>
            <div className='onboarding-main-container'>
              <div className='onboarding_container'>
                <div><img src="./Images/girl_icon.png" alt="" /></div>
                <div>
                  <div className="desktop-h1"><h1><span>Enhancing</span> Workflow Efficiency</h1></div>
                  <p>Scribes play a crucial role in optimizing healthcare delivery, enabling doctors to see more patients and improve overall productivity.</p>
                  <button onClick={handleNext}>NEXT</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div>
            <img src='./Images/Vector 3.png' style={{width:'100%'}} className='vector-img'/>
            <div className='mobile-h1'>
            <h1>Get Ready to<br></br>
                  <span className='on-med-scribe'>Record</span>
                  </h1>
            </div>
            <div className='onboarding-main-container'>
              <div className='onboarding_container'>
                <div><img src="./Images/home_pause.png" alt="" /></div>
                <div className='text'>
                  <div className="desktop-h1">

                  <h1>Get Ready to<br></br>
                  <span className='on-med-scribe'>Record</span>
                  </h1>
                  </div>
                  <p>The presence of medical scribes has been associated with increased physician satisfaction and reduced burnout.</p>
                  <button onClick={handleNext}>NEXT</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div>
            <img src='./Images/Vector 3.png' style={{width:'100%'}} className='vector-img'/>
            <div className="mobile-h1">

                  <h1>Welcome to 
                  <br></br>
                  <span className='on-med-scribe'>MED SCRIBE</span>
                  </h1>

                  </div>
            <div className='signup-signin-main-container'>
              <div className='signup-signin_container'>
                <div><img src="./Images/Mic2.png" alt="" className='img-w-280' /></div>
                <div className='text'>
                  <div className="desktop-h1">

                  <h1>Welcome to 
                  <br></br>
                  <span className='on-med-scribe'>MED SCRIBE</span>
                  </h1>

                  </div>
                  <div className='signup-signin-btn'>
                  <Link to='/login'><button className='sign-in'>Sign in</button></Link>
                  <Link to='/signup'><button className='sign-up'>Sign up</button></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      {renderStep()}
    </div>
  )
}

export default Onboarding2