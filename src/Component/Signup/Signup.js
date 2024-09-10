import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginButton from "../LoginLogout/Login";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Signup() {
    const clientId = '223098918914-7rl4egn7ggo14994bkga1r42qarf20jv.apps.googleusercontent.com';
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const isValidLength = password.length >= 8;
        return { hasUpperCase, hasNumber, isValidLength };
    };

    const passwordStrength = validatePassword(password);

    async function submit(e) {
        e.preventDefault();

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!validatePhone(phone)) {
            alert("Please enter a valid phone number.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);
        formData.append("phone", phone);
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        try {
            const response = await axios.post("https://med-scribe-backend.onrender.com/auth/signup", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            localStorage.setItem('userEmail', email);
            if (response.data.status === "exist") {
                alert("User already exists");
            } else if (response.data.status === "success") {
                alert("Signup successful!");
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setPhone('');
                setProfileImage(null);
                setPreviewImage(null);
                navigate("/dashboard", { state: { id: email } });
            }

        } catch (error) {
            alert("Error during signup");
            console.log(error);
        }
    }

    return (
        <div>
            <img src='./Images/Vector 3.png' style={{ width: '100%' }} className='vector-img' alt="Background" />
            <div className="loginSignup">
                <div className="login">
                    <h1>Hello! Register to Get Started</h1>
                    <form onSubmit={submit} className="signup_form" encType="multipart/form-data">
                        <div className="profile-img-div">
                            <label htmlFor="profile-pic-upload" className='signup-image-uploader'>
                                <img
                                    src={previewImage || "./Images/Ellipse 232.png"}
                                    alt="Profile"
                                    className='profile-image-signup'
                                />
                                <input
                                    type="file"
                                    id="profile-pic-upload"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>

                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Username" required />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" required />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone Number" required />
                        <div className="password-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="show-password-btn"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                        <div className="password-requirements">
                            <p style={{ color: passwordStrength.hasUpperCase ? 'green' : 'red' }}>At least one uppercase letter</p>
                            <p style={{ color: passwordStrength.hasNumber ? 'green' : 'red' }}>At least one numerical digit (0-9)</p>
                            <p style={{ color: passwordStrength.isValidLength ? 'green' : 'red' }}>Minimum 8 characters</p>
                        </div>
                        <div className="password-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Enter Confirm Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="show-password-btn"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                        <div className='login-btn'>
                            <button type="submit">Create New Account</button>
                        </div>
                    </form>
                    <GoogleOAuthProvider clientId={clientId}>
                        <LoginButton />
                    </GoogleOAuthProvider>
                    <p className="already-d-g">Already have an account?<Link style={{ textDecoration: 'none', color:'rebeccapurple' }} to="/login">Login Here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
