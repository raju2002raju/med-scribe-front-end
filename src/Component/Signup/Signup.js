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
        
        // Create a preview of the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    async function submit(e) {
        e.preventDefault();

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

            if (response.data.status === "exist") {
                alert("User already exists");
            } else if (response.data.status === "notexist") {
                navigate("/dashboard", { state: { id: email } });
            }
        } catch (error) {
            alert("Error during signup");
            console.log(error);
        }
    }

    return (
       <div>
             <img src='./Images/Vector 3.png' style={{width:'100%'}} className='vector-img' alt="Background" />
         <div className="loginSignup">
            <div className="login">
                <h1>Hello! Register to Get Started</h1>
                <form onSubmit={submit} className="signup_form">
                    <div>
                    <div className="profile-img-div">
                        <img 
                            src={previewImage || "./Images/Ellipse 232.png"} 
                            alt="Profile" 
                            className='profile-image-signup' 
                        />
                    </div>
                        <label htmlFor="profile-pic-upload" className='signup-image-uploader'>
                            <input type="file" id="profile-pic-upload" accept="image/*" onChange={handleFileChange} hidden />
                            <img src='../Images/iconamoon_edit-fill.png' alt="Edit" />
                        </label>
                    </div>
                    <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter Username" required />
                    <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" required />
                    <input type="tel" onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone Number" required />
                    <div className="password-field">
                        <input 
                            type={showPassword ? "text" : "password"} 
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
                    <div className="password-field">
                        <input 
                            type={showPassword ? "text" : "password"} 
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
                <p>Already have an account <Link style={{ textDecoration: 'none' }} to="/login">Login Here</Link></p>
            </div>
        </div>
       </div>
    );
}

export default Signup;
