// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type svg = {
  path: string,
  viewBox: string,
};

type svgCatalog = {
  [string]: svg,
};

type PropTypes = {
  svgName: string,
};


// ----- Catalogue ----- //

const svgsCatalog: svgCatalog = {
  'arrow-right-straight': {
    path: 'M20 9.35l-9.08 8.54-.86-.81 6.54-7.31H0V8.12h16.6L10.06.81l.86-.81L20 8.51v.84z',
    viewBox: '0 0 20 17.89',
  },
};


// ----- Component ----- //

const svgs = (props: PropTypes) => (
  <svg viewBox={svgsCatalog[props.svgName].viewBox}>
    <path d={svgsCatalog[props.svgName].path} />
  </svg>
);


// ----- Exports ----- //

export default svgs;
