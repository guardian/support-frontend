// @flow

import React from 'react';

// Bubble backgrounds for the new contributions page on mobild
export default function SvgContributionsBgMobile() {

  return (
    <svg className="svg-contributions-bg-mobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 223">
      <defs>
        <circle id="circle-a" cx="89.25" cy="89.25" r="89.25" />
        <circle id="circle-b" cx="35" cy="35" r="35" />
        <circle id="circle-c" cx="61.5" cy="61.5" r="61.5" />
      </defs>
      <g transform="matrix(-1 0 0 1 404 0)" fill="none" fillRule="evenodd">
        <use fill="#121212" href="#circle-a" transform="translate(0 44)" />
        <use fill="#121212" href="#circle-b" transform="matrix(-1 0 0 1 237 153)" />
        <circle fill="#FFF" cx="38.125" cy="28.125" r="28.125" />
        <circle fill="#FF4E36" transform="matrix(-1 0 0 1 479 0)" cx="239.5" cy="151.5" r="17.5" />
        <use fill="#121212" href="#circle-c" transform="matrix(-1 0 0 1 378.872 100.385)" />
        <circle fill="#00B2FF" cx="401.258" cy="194.118" r="28.125" />
      </g>
    </svg>
  );
}
