// @flow

import React from 'react';

// Bubble backgrounds for the new contributions page on desktop
export default function SvgContributionsBgDesktop() {

  return (
    <svg className="svg-contributions-bg-desktop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 580">
      <defs>
        <circle id="circle-a" cx="112.5" cy="112.5" r="112.5"/>
        <circle id="circle-b" cx="140" cy="140" r="140"/>
        <circle id="circle-c" cx="225" cy="225" r="225"/>
      </defs>
      <g transform="translate(-140)" fill="none" fill-rule="evenodd">
        <use fill="#121212" href="#circle-a" transform="translate(1114)"/>
        <use fill="#121212" href="#circle-b" transform="translate(107 300)"/>
        <circle fill="#E7D4B9" transform="matrix(-1 0 0 1 638 0)" cx="319" cy="243" r="70"/>
        <circle fill="#FEC8D3" transform="matrix(-1 0 0 1 2714 0)" cx="1357" cy="329" r="140"/>
        <circle fill="#00B2FF" transform="matrix(-1 0 0 1 253 0)" cx="126.5" cy="202.5" r="126.5"/>
        <circle fill="#FF4E36" transform="matrix(-1 0 0 1 1649 0)" cx="824.5" cy="123.5" r="58.5"/>
        <circle fill="#FFF" transform="matrix(-1 0 0 1 2486 0)" cx="1243" cy="509" r="70"/>
        <use fill="#121212" href="#circle-c" transform="translate(766 129)"/>
      </g>
    </svg>
  );
}
