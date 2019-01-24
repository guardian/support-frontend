import React from 'react';

const styles = {
  display: 'flex',
  height: '100vh',
  width: '100vw',
  alignItems: 'center',
  justifyContent: 'center',
};

export const withCenterAlignment = (storyFn) => (
  <div style={styles}>
    { storyFn() }
  </div>
);
