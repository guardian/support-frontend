// @flow

// ----- Imports ----- //

import React from 'react';
import SocialShare from 'components/socialShare/socialShare';


// ----- Component ----- //

export default function SpreadTheWord() {
  const title = 'Help stretch the signal';
  const message = 'Invite others to support us so that we can deliver truthful, independent reporting on the climate crisis – and keep it open for everyone around the world';

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
