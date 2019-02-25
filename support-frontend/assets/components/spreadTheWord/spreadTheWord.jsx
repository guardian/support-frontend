// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import SocialShare from 'components/socialShare/socialShare';


// ----- Component ----- //

export default function SpreadTheWord() {

  return (
    <div className="component-spread-the-word">
      <PageSection
        modifierClass="spread-the-word"
        heading="Spread the word"
      >
        <p className="component-spread-the-word__description">
          We report for everyone. Let your friends and followers know that you
          support independent journalism.
        </p>
        <div className="component-spread-the-word__share">
          <SocialShare name="facebook" />
          <SocialShare name="twitter" />
        </div>
      </PageSection>
    </div>
  );

}
