import React from 'react';

const ScreenWrapper = ({ children, style }) => {
  return (
    <div style={{ ...styles.container, ...style }}>
      {children}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#F8F9FA',
    minHeight: '100vh',
    padding: 'env(safe-area-inset-top, 20px) env(safe-area-inset-right, 20px) env(safe-area-inset-bottom, 20px) env(safe-area-inset-left, 20px)',
    boxSizing: 'border-box',
  },
};

export default ScreenWrapper;