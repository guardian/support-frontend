import React from 'react';

const svgsCatalog = {
  'arrow-right-straight': {
      path : 'M20 9.35l-9.08 8.54-.86-.81 6.54-7.31H0V8.12h16.6L10.06.81l.86-.81L20 8.51v.84z',
      viewBox: '0 0 20 17.89'
  }
};

const svgs = props => (
  <svg viewBox={svgsCatalog[props.svgName].viewBox}>
    <path d={svgsCatalog[props.svgName].path}></path>
  </svg>
);

export default svgs