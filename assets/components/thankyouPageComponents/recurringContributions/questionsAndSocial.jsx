// @flow

// ----- Imports ----- //

import React from 'react';

import InfoSection from 'components/infoSection/infoSection';
import SocialShare from 'components/socialShare/socialShare';
import { statelessInit as pageInit } from 'helpers/page/page';

// ----- Page Startup ----- //

pageInit();

// ----- Component ----- //


function QuestionsAndSocial() {
  return (
    <div>
      <InfoSection heading="Questions?" className="thankyou__questions">
        <p>
          If you have any questions about contributing to the Guardian,
          please <a href="mailto:contribution.support@theguardian.com">contact us</a>
        </p>
      </InfoSection>
      <InfoSection
        heading="Spread the word"
        className="thankyou__spread-the-word"
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

