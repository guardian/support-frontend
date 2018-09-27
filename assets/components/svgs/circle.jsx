// @flow

// ----- Imports ----- //

import React from 'react';


// ----- SVG ----- //

export default function SvgCircle() {

  return (
    <svg
      className="svg-circle"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      preserveAspectRatio="xMinYMid"
    >
      <circle cx="5" cy="5" r="5" fill="#ffe500" />
    </svg>
  );
}
