// @flow

// ----- Imports ----- //

import React from 'react';

import type { Node } from 'react';

import SvgFacebook from 'components/svgs/facebook';
import SvgTwitter from 'components/svgs/twitter';


// ---- Types ----- //

type Platform = 'facebook' | 'twitter';

type PropTypes = {| name: Platform |};

type SocialMedia = {
  link: string,
  svg: Node,
  a11yHint: string,
};


// ----- Setup ----- //

const socialMedia: {
  [Platform]: SocialMedia,
} = {
  facebook: {
    link: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsupport.theguardian.com%2F%3FINTCMP%3Dsocial&t=',
    svg: <SvgFacebook />,
    a11yHint: 'Share on facebook',
  },
  twitter: {
    link: 'https://twitter.com/intent/tweet?text=I%27ve+just+contributed+to+the+Guardian.+Join+me+in+supporting+independent+journalism+https%3A%2F%2Fsupport.theguardian.com&amp;related=guardian',
    svg: <SvgTwitter />,
    a11yHint: 'Share on twitter',
  },
};


// ----- Component ----- //

export default function SocialShare(props: PropTypes) {

  const a11yId = `component-social-share-a11y-hint-${props.name}`;

  return (
    <a
      className="component-social-share"
      href={socialMedia[props.name].link}
      aria-labelledby={a11yId}
    >
      {socialMedia[props.name].svg}
      <p id={a11yId} className="accessibility-hint">
        {socialMedia[props.name].a11yHint}
      </p>
    </a>
  );

}
