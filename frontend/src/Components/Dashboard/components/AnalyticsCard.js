import React from 'react';

/**
 * Card holder for analytics components. Mainly for charts.
 * @param {Child components to be shown on the Analytics Card} children Child Components 
 */
const AnalyticsCard = ({ children }) => {

  const cardStyle = {
    backgroundColor: 'white', 
    borderRadius: '15px',
    backgroundColor: "white",
    boxShadow: "1px 2px 3px 1px rgba(0,0,0,0.12)",
    borderRadius: "15px",
    textAlign: "left",
    height: "100%",
  };

  return (
    <div style={cardStyle}>
      {children}
    </div>
  );
};

export default AnalyticsCard;
