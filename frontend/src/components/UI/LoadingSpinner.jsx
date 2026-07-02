import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'sage' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const colorClasses = {
    sage: 'border-sage-500',
    white: 'border-white',
    terracotta: 'border-terracotta-500'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
