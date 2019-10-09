// @flow

// ----- Imports ----- //

import React from 'react';

import type { Node } from 'react';

import SvgFacebook from 'components/svgs/facebook';
import SvgTwitter from 'components/svgs/twitter';
import SvgLinkedin from 'components/svgs/linkedin';
import SvgEmail from 'components/svgs/email';
import { trackComponentClick } from 'helpers/tracking/behaviour';

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

// The links back to support.theguardian.com embedded within the share links
// below have the following tracking based on what the given platform supports:
// Facebook: acquisitionData parameter & INTCMP parameter
// Twitter: INTCMP parameter (does not support object syntax in links / deletes link )
// Linkedin: None (strips out parameter values whether in object format or plaintext)
// email: INTCMP parameter ([gmail] decodes object syntax in links / doesn't appear clickable)

const socialMedia: {
  [SharePlatform]: SocialMedia,
} = {
  facebook: {
    link: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsupport.theguardian.com%2Fcontribute%2Fclimate-pledge-2019?acquisitionData=%7B%22source%22%3A%22SOCIAL%22%2C%22campaignCode%22%3A%22component-social-facebook%22%2C%22componentId%22%3A%22component-social-facebook%22%7D&INTCMP=component-social-facebook',
    svg: <SvgFacebook />,
    a11yHint: 'Share on facebook',
    windowFeatures: SocialWindowFeatures,
  },
  twitter: {
    link: 'https://twitter.com/intent/tweet?url=https%3A%2F%2Fsupport.theguardian.com%2Fcontribute%2Fclimate-pledge-2019?INTCMP=component-social-twitter&text=Join%20me%20in%20supporting%20The%20Guardian%E2%80%99s%20pledge%20to%20be%20a%20truthful%20voice%20on%20the%20climate%20crisis',
    svg: <SvgTwitter />,
    a11yHint: 'Share on twitter',
    windowFeatures: SocialWindowFeatures,
  },
  linkedin: {
    link: 'http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fsupport.theguardian.com%2Fcontribute%2Fclimate-pledge-2019',
    svg: <SvgLinkedin />,
    a11yHint: 'Share on linkedin',
    windowFeatures: SocialWindowFeatures,
  },
  email: {
    link: 'mailto:?subject=Join%20me%20in%20supporting%20The%20Guardian%E2%80%99s%20pledge%20to%20be%20a%20truthful%20voice%20on%20the%20climate%20crisis&body=The%20Guardian%20recognises%20the%20climate%20emergency%20as%20the%20defining%20issue%20of%20our%20lifetimes%20%E2%80%93%20and%20pledges%20to%20be%20truthful%2C%20resolute%20and%20undeterred%20in%20pursuing%20their%20reporting%20on%20the%20environment.%20Support%20from%20readers%20makes%20this%20work%20possible%20and%20protects%20The%20Guardian%E2%80%99s%20independence.%3A%20https%3A%2F%2Fsupport.theguardian.com%2Fcontribute%2Fclimate-pledge-2019?INTCMP=component-social-email',
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
