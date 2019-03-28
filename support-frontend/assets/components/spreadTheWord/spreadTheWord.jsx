// @flow

// ----- Imports ----- //

import React from 'react';

import SocialShare from 'components/socialShare/socialShare';


// ----- Component ----- //

export default function SpreadTheWord() {

  return (
    <div className="component-spread-the-word">
      <h3 className="component-spread-the-word__title">Share your support for independent journalism</h3>
      <p className="component-spread-the-word__description">
          Let your friends, family and followers know that you made a valuable contribution to The Guardian today
      </p>
      <div className="component-spread-the-word__share">
        <SocialShare name="facebook" />
        <SocialShare name="twitter" />
        <SocialShare name="linkedin" />
        <SocialShare name="email" />
      </div>
    </div>
  );

}
