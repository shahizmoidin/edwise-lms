// src/Logo.jsx
import React from 'react';
import logoImage from '../../Assets/logo.png'; // Path to your logo image

const Logo = () => {
  return <img src={logoImage} alt="eLearn Logo" className="logo" />;
};
export default Logo;