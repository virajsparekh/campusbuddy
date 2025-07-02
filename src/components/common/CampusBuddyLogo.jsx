import React from 'react';

const CampusBuddyLogo = ({ width, height, style = {} }) => (
  <img
    src="/campusbuddy-logo.png"
    alt="CampusBuddy Logo"
    style={{
      display: 'block',
      maxWidth: width || '500px',
      height: height || 'auto',
      ...style
    }}
    className="campusbuddy-logo"
    loading="lazy"
  />
);

export default CampusBuddyLogo; 