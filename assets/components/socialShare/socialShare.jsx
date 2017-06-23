// @flow

// ----- Imports ----- //

import React from 'react';

import Svg from 'components/svg/svg';

import type { SvgName } from 'components/svg/svg';


// ---- Types ----- //

type PropTypes = {
  name: string,
};

type SocialMedia = {
  link: string,
  svg: SvgName,
};


// ----- Setup ----- //

const socialMedia: {
  [string]: SocialMedia,
} = {
  facebook: {
    link: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsupport.theguardian.com%2F%3FINTCMP%3Dsocial&t=',
    svg: 'facebook',
  },
  twitter: {
    link: 'https://twitter.com/intent/tweet?text=I%27ve+just+contributed+to+the+Guardian.+Join+me+in+supporting+independent+journalism+https%3A%2F%2Fsupport.theguardian.com&amp;related=guardian',
    svg: 'twitter',
  },
};


// ----- Component ----- //

export default function SocialShare(props: PropTypes) {

  return (
    <a className="component-social-share" href={socialMedia[props.name].link}>
      <Svg svgName={socialMedia[props.name].svg} />
    </a>
  );

}
