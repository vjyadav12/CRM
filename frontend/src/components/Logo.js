import React from 'react';

const Logo = ({ size = 192 }) => (
  <svg width={size} height={size} viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="192" height="192" rx="96" fill="#3f51b5"/>
    <text
      x="96"
      y="120"
      fontFamily="Arial"
      fontSize="120"
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      C
    </text>
  </svg>
);

export default Logo; 