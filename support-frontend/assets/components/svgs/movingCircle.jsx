// @flow

import React from 'react';

export default function SvgMovingCircle() {

  return (
    <svg
      className="svg-moving-circle"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 75 30"
      preserveAspectRatio="xMinYMid"
    >
      <g fill="#FB0" filRule="evenodd">
        <circle fillOpacity=".1" cx="60" cy="15" r="15" />
        <circle fillOpacity=".4" cx="30" cy="15" r="15" />
        <circle fillOpacity=".2" cx="46" cy="15" r="15" />
        <circle cx="15" cy="15" r="15" />
      </g>
    </svg>
  );
}
