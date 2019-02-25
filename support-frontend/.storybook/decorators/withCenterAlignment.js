import React from 'react';

const styles = {
  display: 'flex',
  padding: '10vh 10vh',
  minHeight: '100vh',
  width: '100vw',
  boxSizing: 'border-box',
  alignItems: 'center',
  justifyContent: 'center',
};

export const withCenterAlignment = (storyFn) => (
  <div style={styles}>
    { storyFn() }
  </div>
);
