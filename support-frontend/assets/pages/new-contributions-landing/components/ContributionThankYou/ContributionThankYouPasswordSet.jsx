// @flow

// ----- Imports ----- //

import React from 'react';
import MarketingConsent from '../MarketingConsentContainer';
import { ButtonWithRightArrow } from '../ButtonWithRightArrow/ButtonWithRightArrow';
import SpreadTheWord from 'pages/new-contributions-landing/components/ContributionThankYou/ContributionThankYou';

// ----- Render ----- //

function ContributionThankYouPasswordSet() {
  return (
    <div className="thank-you__container">
      <div className="gu-content__form gu-content__form--thank-you">
        <h1 className="header">You now have a Guardian account</h1>
        <section className="confirmation">
          <p className="confirmation__message">
            Stay signed in so we can recognise you on The Guardian, and you can easily manage your payments and
            preferences.
          </p>
        </section>
        <MarketingConsent />
        <SpreadTheWord />
        <div className="gu-content__return-link">
          <AnchorButton
            href={'https://www.theguardian.com'}
            appearance={'greyHollow'}
            aria-label={'Return to The Guardian'}
            icon={<SvgArrowLeft/>}
            iconSide={'left'}
          >
            Return to The Guardian
          </AnchorButton>
        </div>
      </div>

      <div className="gu-content__blurb gu-content__blurb--thank-you">
        <h1 className="gu-content__blurb-header">Thank you for a valuable contribution</h1>
        <p className="gu-content__blurb-blurb gu-content__blurb-blurb--thank-you">
          Your support helps safeguard The Guardian’s editorial independence and it means we can keep our quality, investigative journalism open to everyone around the world.
        </p>
      </div>
    </div>
  );
  // return (
  //   <div className="thank-you__container">
  //     <h1 className="header">You now have a Guardian account</h1>
  //     <section className="confirmation">
  //       <p className="confirmation__message">
  //         Stay signed in so we can recognise you on The Guardian, and you can easily manage your payments and
  //         preferences.
  //       </p>
  //     </section>
  //     <MarketingConsent />
  //     <ButtonWithRightArrow
  //       componentClassName="confirmation confirmation--backtothegu"
  //       buttonClassName=""
  //       accessibilityHintId="accessibility-hint-return-to-guardian"
  //       type="button"
  //       buttonCopy="Return to The Guardian&nbsp;"
  //       onClick={
  //         () => {
  //           window.location.assign('https://www.theguardian.com');
  //         }
  //       }
  //     />
  //   </div>
  // );
}

export default ContributionThankYouPasswordSet;
