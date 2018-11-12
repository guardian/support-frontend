// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import ReturnSection from 'components/returnSection/returnSection';
import HeadingBlock from 'components/headingBlock/headingBlock';
import ProductHero, {
  type GridImages,
  type ImagesByCountry,
} from 'components/productHero/productHero';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import { type Stage, type State } from '../digitalSubscriptionCheckoutReducer';
import ThankYouContent from './thankYouContent';
import CheckoutForm from './checkoutForm';
import { type State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';


// ----- Types ----- //

type PropTypes = {|
  checkout: {
    stage: Stage,
  },
  countryGroupId: CountryGroupId,
  marketingConsent: MarketingConsentState,
|};


// ----- Setup ----- //

const defaultHeroes: GridImages = {
  breakpoints: {
    mobile: {
      gridId: 'digitalSubscriptionHeaderMobile',
      srcSizes: [342, 684, 1200],
      imgType: 'png',
    },
    tablet: {
      gridId: 'digitalSubscriptionHeaderTablet',
      srcSizes: [500, 1000, 2000],
      imgType: 'png',
    },
    desktop: {
      gridId: 'digitalSubscriptionHeaderDesktop',
      srcSizes: [500, 1000, 2000, 4045],
      imgType: 'png',
    },
  },
  fallback: 'digitalSubscriptionHeaderDesktop',
};

const heroesByCountry: ImagesByCountry = {
  GBPCountries: defaultHeroes,
  UnitedStates: defaultHeroes,
  International: defaultHeroes,
  AUDCountries: {
    breakpoints: {
      mobile: {
        gridId: 'digitalSubscriptionHeaderMobileAU',
        srcSizes: [310, 620, 1088],
        imgType: 'png',
      },
      tablet: {
        gridId: 'digitalSubscriptionHeaderTabletAU',
        srcSizes: [500, 1000, 2000],
        imgType: 'png',
      },
      desktop: {
        gridId: 'digitalSubscriptionHeaderDesktopAU',
        srcSizes: [500, 1000, 2000, 4045],
        imgType: 'png',
      },
    },
    fallback: 'digitalSubscriptionHeaderDesktopAU',
  },
};


// ----- State/Props Maps ----- //

function mapStateToProps(state: State): PropTypes {

  return {
    checkout: state.page.checkout,
    countryGroupId: state.common.internationalisation.countryGroupId,
    marketingConsent: state.page.marketingConsent,
  };

}


// ----- Component ----- //

function CheckoutStage(props: PropTypes) {

  switch (props.checkout.stage) {

    case 'thankyou':
      return (
        <div>
          <ProductHero
            countryGroupId={props.countryGroupId}
            imagesByCountry={heroesByCountry}
            altText="digital subscription"
            fallbackImgType="png"
          />
          <LeftMarginSection>
            <HeadingBlock overheading="Thank You" heading="Your Digital Pack subscription is now live">
              <p>Thank you for supporting our journalism</p>
            </HeadingBlock>
          </LeftMarginSection>
          <ThankYouContent
            countryGroupId={props.countryGroupId}
            context="DIGITAL_SUBSCRIPTION_CHECKOUT"
          />
          <ReturnSection />
        </div>
      );

    case 'checkout':
    default:
      return (
        <LeftMarginSection>
          <CheckoutForm />
        </LeftMarginSection>
      );

  }

}


// ----- Export ----- //

export default connect(mapStateToProps)(CheckoutStage);
