// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type Contrib, getSpokenType } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgArrowRight from 'components/svgs/arrowRightStraight';
import SvgSubscribe from 'components/svgs/subscribe';
import SvgNewsletters from 'components/svgs/newsletters';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  contributionType: Contrib,
};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
});

// ----- Render ----- //

function ContributionThankYou(props: PropTypes) {
  return (
    <div className="thank-you__container">
      <h1 className="header">Thank you for a valuable contribution</h1>

      {props.contributionType !== 'ONE_OFF' ? (
        <section className="confirmation">
          <p className="confirmation__message">
            Look out for an email confirming your {getSpokenType(props.contributionType)} recurring payment.
          </p>
        </section>
      ) : null}

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
        <p className="confirmation__meta"><small>You can stop these at any time.</small></p>
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

export default connect(mapStateToProps)(ContributionThankYou);
