// @flow

// ----- Imports ----- //

import React from 'react';
import SocialShare from 'components/socialShare/socialShare';


// ----- Component ----- //

export default function SpreadTheWord() {
  const title = 'Invite others to support The Guardian';
  const message = 'To join you and over one million others in supporting a different model for open, independent journalism – so more people can access factual information for free';

  return (
    <div className="contribution-thank-you-block">
      <h3 className="contribution-thank-you-block__title">{title}</h3>
      <p className="contribution-thank-you-block__message">{message}</p>
      <div className="component-spread-the-word__share">
        <SocialShare name="facebook" />
        <SocialShare name="twitter" />
        <SocialShare name="linkedin" />
        <SocialShare name="email" />
      </div>
    </div>
  );

}
