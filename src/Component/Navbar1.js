import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNavbar = ({ activePath, handleActive }) => {
    return (
        <div className='mobile-navbar-container'>
            <div className="mobile-navbar">
                <Link
                    to="/dashboard"
                    className={`nav-link ${activePath === '/dashboard' ? 'active' : ''}`}
                    onClick={() => handleActive('/')}
                >
                    <img src={activePath === '/dashboard' ? '../Images/mobile-hove-active.png' : '../Images/mobile-home.png'}  />

                </Link>
                <Link
                    to="/dashboard/transcribe_audio"
                    className={`nav-link ${activePath === '/dashboard/transcribe_audio' ? 'active' : ''}`}
                    onClick={() => handleActive('/dashboard/transcribe_audio')}
                >
                    <img src={activePath === '/dashboard/transcribe_audio' ?  '../Images/mobile-appointment-active.png' : '../Images/mobile-appointments.png'}/>
                </Link>
                <Link
                    to="/visited_clients"
                    className={`nav-link ${activePath === '/visited_clients' ? 'active' : ''}`}
                    onClick={() => handleActive('/visited_clients')}
                >
                    <img src={activePath === '/visited_clients' ? '../Images/mobile-visited-active.png' : '../Images/mobile-visited.png'} />
                </Link>
                <Link
                    to="/setting"
                    className={`nav-link ${activePath === '/setting' ? 'active' : ''}`}
                    onClick={() => handleActive('/setting')}
                >
                    <img src={activePath === '/setting' ? '../Images/mobile-setting-active.png' : '../Images/mobile-setting.png'} />
                </Link>
            </div>
        </div>
    );
};

const DesktopNavbar = ({ activePath, handleActive }) => {
    return (
        <div className='desktop-navbar'>
            <aside className="sidebar">
                <div className="logo">
                    <img src="../Images/Mic.png" alt="Med Scribe" />
                    <span>MED SCRIBE</span>
                </div>
                <nav>
                    <ul>
                        <li className={activePath === '/dashboard' ? 'active' : ''}>
                            <Link to="/dashboard" onClick={() => handleActive('/dashboard')}>
                                <img 
                                    src={activePath === '/dashboard' ? '../Images/home.png' : '../Images/home (1).png'} 
                                    alt="Home" 
                                /> Home
                            </Link>
                        </li>
                        <li className={activePath === '/dashboard/transcribe_audio' ? 'active' : ''}>
                            <Link to='/dashboard/transcribe_audio' onClick={() => handleActive('/dashboard/transcribe_audio')}>
                                <img 
                                    src={activePath === '/dashboard/transcribe_audio' ? '../Images/Appointment-Active.png' : '../Images/Appointment.png'} 
                                    alt="Appointments" 
                                /> Appointments
                            </Link>
                        </li>
                        <li className={activePath === '/visited_clients' ? 'active' : ''}>
                            <Link to='/visited_clients' onClick={() => handleActive('/visited_clients')}>
                                <img 
                                    src={activePath === '/visited_clients' ? '../Images/fa-solid_users (1).png' : '../Images/fa-solid_users.png'} 
                                    alt="Visited Clients" 
                                /> Visited Clients
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="settings">
                    <Link
                        to='/setting'
                        className={activePath === '/setting' ? 'active' : ''}
                        onClick={() => handleActive('/setting')}
                    >
                        <img 
                            src={activePath === '/setting' ? '../Images/settings-active.png' : '../Images/fluent_settings.png'} 
                         
                        /> Settings
                    </Link>
                </div>
            </aside>
        </div>
    );
};

const Navbar1 = () => {
    const location = useLocation();
    const [activePath, setActivePath] = useState(location.pathname);

    const handleActive = (path) => {
        setActivePath(path);
    };

    return (
        <div className="navbar-container">
            <MobileNavbar activePath={activePath} handleActive={handleActive} />
            <DesktopNavbar activePath={activePath} handleActive={handleActive} />
        </div>
    );
};

export default Navbar1;
