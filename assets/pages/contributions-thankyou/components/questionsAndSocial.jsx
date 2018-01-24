// @flow

// ----- Imports ----- //

import React from 'react';

import InfoSection from 'components/infoSection/infoSection';
import SocialShare from 'components/socialShare/socialShare';

// ----- Component ----- //


function QuestionsAndSocial() {
  return (
    <div className="questions-and-social">
      <InfoSection heading="Questions?" className="questions-and-social__questions">
        <p>
          If you have any questions about contributing to the Guardian,
          please <a href="mailto:contribution.support@theguardian.com">contact us</a>
        </p>
      </InfoSection>
      <InfoSection
        heading="Spread the word"
        className="questions-and-social__spread-the-word"
      >
        <p>
          We report for everyone. Let your friends and followers know that
          you support independent journalism.
        </p>
        <SocialShare name="facebook" />
        <SocialShare name="twitter" />
      </InfoSection>
    </div>
  );
}

// ----- Exports ----- //

export default QuestionsAndSocial;

