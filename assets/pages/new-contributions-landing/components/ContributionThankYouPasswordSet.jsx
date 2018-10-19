// @flow

// ----- Imports ----- //

import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgArrowRight from 'components/svgs/arrowRightStraight';
import SvgSubscribe from 'components/svgs/subscribe';
import SvgNewsletters from 'components/svgs/newsletters';

// ----- Render ----- //

function ContributionThankYouPasswordSet() {
  return (
    <div className="thank-you__container">
      <h1 className="header">You now have a Guardian account</h1>
      <section className="confirmation">
        <p className="confirmation__message">
          Stay signed in so we can recognise you on The Guardian, and you can easily manage your payments and
          preferences.
        </p>
      </section>
      <section className={classNameWithModifiers('confirmation', ['newsletter'])}>
        <h3 className="confirmation__title">Subscriptions, membership and contributions</h3>
        <p>
          Get related news and offers – whether you are a subscriber, member,
          contributor or would like to become one.
        </p>
        <a className={classNameWithModifiers('button', ['newsletter'])} href="/subscribe">
          <SvgSubscribe />
          Sign me up
        </a>
        <p className="confirmation__meta">
          <small>You can stop these at any time.</small>
        </p>
        <SvgNewsletters />
      </section>

      <div className={classNameWithModifiers('confirmation', ['backtothegu'])}>
        <a className={classNameWithModifiers('button', ['wob'])} href="https://www.theguardian.com">
          Return to The Guardian&nbsp;
          <SvgArrowRight />
        </a>
      </div>
    </div>
  );
}

export default ContributionThankYouPasswordSet;
