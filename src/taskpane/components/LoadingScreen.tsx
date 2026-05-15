import React from 'react';

const LoadingScreen: React.FC = () => (
  <div className="screen">
    <div className="spinner-wrap">
      <div className="spinner" />
      <p>Parsing event details...</p>
    </div>
  </div>
);

export default LoadingScreen;
