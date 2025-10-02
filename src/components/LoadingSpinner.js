import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizeMap = {
    sm: { width: '1rem', height: '1rem' },
    md: { width: '2rem', height: '2rem' },
    lg: { width: '3rem', height: '3rem' }
  };

  const spinnerStyle = sizeMap[size] || sizeMap.md;

  const content = (
    <div className="d-flex flex-column align-items-center">
      <Spinner 
        animation="border" 
        role="status"
        style={spinnerStyle}
        className="mb-2"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      {text && <div className="text-muted">{text}</div>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="d-flex justify-content-center align-items-center" 
           style={{ minHeight: '100vh' }}>
        {content}
      </div>
    );
  }

  return (
    <div className="loading-spinner">
      {content}
    </div>
  );
};

export default LoadingSpinner;
