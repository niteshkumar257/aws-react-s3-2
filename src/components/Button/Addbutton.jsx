import React from 'react';
import "./AddButton.scss"

const Button = ({ isLoading, onClick, children, ...rest }) => {
  return (
    <button
    className={`global-button ${isLoading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
