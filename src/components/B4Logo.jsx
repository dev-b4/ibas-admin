import React from 'react';



export const B4Logo = ({
  className = '',
  size = 'md',
}) => {
  const logoUrl = "https://b4.capital/pt/wp-content/uploads/2024/06/b4-icone-site.png";

  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-18',
    xl: 'h-20 sm:h-28',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoUrl}
        alt="B4 Capital Logo"
        className={`${selectedSize} w-auto object-contain drop-shadow-md transition-transform duration-300`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};


