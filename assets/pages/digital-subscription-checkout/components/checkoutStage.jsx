// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import SubscriptionsThankYou from 'components/subscriptionsThankYou/subscriptionsThankYou';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { type Stage } from '../digitalSubscriptionCheckoutReducer';
import ThankYouContent from './thankYouContent';


// ----- Types ----- //

type PropTypes = {|
  stage: Stage;
  countryGroupId: CountryGroupId;
|};


// ----- State/Props Maps ----- //

function mapStateToProps(state): PropTypes {

  return {
    stage: state.page.stage,
    countryGroupId: state.page.countryGroupId,
  };

}


// ----- Component ----- //

function CheckoutStage(props: PropTypes) {

  switch (props.stage) {

    case 'thankyou':
      return (
        <SubscriptionsThankYou heading="Your Digital Pack Subscription is now live">
          <ThankYouContent countryGroupId={props.countryGroupId} />
        </SubscriptionsThankYou>
      );

    case 'checkout':
    default:
      return (
        <LeftMarginSection>
          <p>Placeholder</p>
        </LeftMarginSection>
      );

  }

}


// ----- Export ----- //

export default connect(mapStateToProps)(CheckoutStage);
