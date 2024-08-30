import React, { useState } from 'react';

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="popup-container">

            <img
                src='./Images/profile_logo.png'
                style={{ width: '50px', cursor: 'pointer' }}
                alt="Profile Logo"
                onClick={togglePopup}
            />
            {isOpen && (
                <div className="popup">
                    <div className="popup-content">
                   
                        <h2>Profile Information</h2>
                        <p>This is where your profile information would be displayed.</p>
                        <button onClick={togglePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
