// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import ReturnSection from 'components/returnSection/returnSection';
import HeadingBlock from 'components/headingBlock/headingBlock';
import ProductHero from 'components/productHero/productHero';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { type Stage, type State } from '../digitalSubscriptionCheckoutReducer';
import ThankYouContent from './thankYouContent';


// ----- Types ----- //

type PropTypes = {|
  stage: Stage;
  countryGroupId: CountryGroupId;
|};


// ----- State/Props Maps ----- //

function mapStateToProps(state: State): PropTypes {

  return {
    stage: state.page.stage,
    countryGroupId: state.common.internationalisation.countryGroupId,
  };

}


// ----- Component ----- //

function CheckoutStage(props: PropTypes) {

  switch (props.stage) {

    case 'thankyou':
      return (
        <div>
          <ProductHero countryGroupId={props.countryGroupId} />
          <HeadingBlock heading="Your Digital Pack Subscription is now live">
            <p>We have sent you an email confirmation</p>
          </HeadingBlock>
          <ThankYouContent countryGroupId={props.countryGroupId} />
          <ReturnSection />
        </div>
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
