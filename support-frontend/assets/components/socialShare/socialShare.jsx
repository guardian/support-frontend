// @flow

// ----- Imports ----- //

import React from 'react';

import type { Node } from 'react';

import SvgFacebook from 'components/svgs/facebook';
import SvgTwitter from 'components/svgs/twitter';
import SvgLinkedin from 'components/svgs/linkedin';
import SvgEmail from 'components/svgs/email';
import { trackComponentClick } from 'helpers/tracking/ophanComponentEventTracking';

// ---- Types ----- //

type SharePlatform = 'facebook' | 'twitter' | 'linkedin' | 'email';

type PropTypes = {| name: SharePlatform |};

type SocialMedia = {
  link: string,
  svg: Node,
  a11yHint: string,
  windowFeatures: string
};

const SocialWindowFeatures = 'menubar=no, toolbar=no, resizable=yes, scrollbars=yes, width=500, height=400';

// ----- Setup ----- //

const socialMedia: {
  [SharePlatform]: SocialMedia,
} = {
  facebook: {
    link: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsupport.theguardian.com%2Fcontribute',
    svg: <SvgFacebook />,
    a11yHint: 'Share on facebook',
    windowFeatures: SocialWindowFeatures,
  },
  twitter: {
    link: 'https://twitter.com/intent/tweet?url=https%3A%2F%2Fsupport.theguardian.com%2Fcontribute&text=Join%20me%20and%20over%20one%20million%20others%20in%20supporting%20a%20different%20model%20for%20open%2C%20independent%20journalism.%20Together%20we%20can%20help%20safeguard%20The%20Guardian%E2%80%99s%20future%20%E2%80%93%20so%20more%20people%2C%20across%20the%20world%2C%20can%20keep%20accessing%20factual%20information%20for%20free',
    svg: <SvgTwitter />,
    a11yHint: 'Share on twitter',
    windowFeatures: SocialWindowFeatures,
  },
  linkedin: {
    link: 'http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fsupport.theguardian.com%2Fcontribute&title=Join%20me%20and%20over%20one%20million%20others%20in%20supporting%20a%20different%20model%20for%20open%2C%20independent%20journalism.%20Together%20we%20can%20help%20safeguard%20The%20Guardian%E2%80%99s%20future%20%E2%80%93%20so%20more%20people%2C%20across%20the%20world%2C%20can%20keep%20accessing%20factual%20information%20for%20free',
    svg: <SvgLinkedin />,
    a11yHint: 'Share on linkedin',
    windowFeatures: SocialWindowFeatures,
  },
  email: {
    link: 'mailto:?subject=Join%20me%20in%20supporting%20open%2C%20independent%20journalism&body=Join%20me%20and%20over%20one%20million%20others%20in%20supporting%20a%20different%20model%20for%20open%2C%20independent%20journalism.%20Together%20we%20can%20help%20safeguard%20The%20Guardian%E2%80%99s%20future%20%E2%80%93%20so%20more%20people%2C%20across%20the%20world%2C%20can%20keep%20accessing%20factual%20information%20for%20free%3A%20https%3A%2F%2Fsupport.theguardian.com%2Fcontribute',
    svg: <SvgEmail />,
    a11yHint: 'Share by email',
    windowFeatures: '',
  },
};


// ----- Component ----- //

export default function SocialShare(props: PropTypes) {

  const a11yId = `component-social-share-a11y-hint-${props.name}`;

  function onShare(eventName: string, eventLink: string, windowFeatures: string): () => void {
    return (): void => {
      trackComponentClick(eventName);
      window.open(
        eventLink,
        '',
        windowFeatures,
      );
    };
  }


  return (
    <button
      className="component-social-share"
      onClick={
          onShare(`contributions-share-${props.name}`, socialMedia[props.name].link, socialMedia[props.name].windowFeatures)
      }
      aria-labelledby={a11yId}
    >
      {socialMedia[props.name].svg}
      <p id={a11yId} className="accessibility-hint">
        {socialMedia[props.name].a11yHint}
      </p>
    </button>
  );

}
