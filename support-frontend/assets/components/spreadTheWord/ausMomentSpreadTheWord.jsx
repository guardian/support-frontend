// @flow

// ----- Imports ----- //

import React from 'react';
import SocialShare from 'components/socialShare/socialShare';


// ----- Component ----- //

export default function AusMomentSpreadTheWord() {
  const title = 'Share your support';
  const message = 'We need more people like you. Invite your friends, family and colleagues in Australia and beyond to support the Guardian. We’ll email you to let you know if one or more people make a contribution from your post or message. You’re doing something powerful to help sustain our open, independent journalism – thank you.';

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
