// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import ProductHero, {
  type GridImages,
  type ImagesByCountry,
} from 'components/productHero/productHero';
import HeadingBlock from 'components/headingBlock/headingBlock';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import ProgressMessage from 'components/progressMessage/progressMessage';
import ProductPageContentBlock, { Divider } from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { LargeParagraph } from 'components/productPage/productPageTextBlock/productPageTextBlock';

import { type Stage, type State } from '../digitalSubscriptionCheckoutReducer';

import ThankYouContent from './thankYouContent';
import ThankYouPendingContent from './thankYouPendingContent';
import ThankYouExistingContent from './thankYouExistingContent';
import CheckoutForm from './checkoutForm';
import ReturnSection from './returnSection';


// ----- Types ----- //

type PropTypes = {|
  stage: Stage,
  formSubmitted: boolean,
  countryGroupId: CountryGroupId,
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
  EURCountries: defaultHeroes,
  NZDCountries: defaultHeroes,
  Canada: defaultHeroes,
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

const ThankYouHero = ({ countryGroupId }: {countryGroupId: CountryGroupId}) => (
  <ProductHero
    countryGroupId={countryGroupId}
    imagesByCountry={heroesByCountry}
    altText="digital subscription"
    fallbackImgType="png"
  />
);


// ----- State/Props Maps ----- //

function mapStateToProps(state: State): PropTypes {

  return {
    stage: state.page.checkout.stage,
    formSubmitted: state.page.checkout.formSubmitted,
    countryGroupId: state.common.internationalisation.countryGroupId,
  };

}


// ----- Component ----- //

function CheckoutStage(props: PropTypes) {

  switch (props.stage) {

    case 'thankyou':
      return (
        <div className="thank-you-stage">
          <ThankYouHero
            countryGroupId={props.countryGroupId}
          />
          <HeroWrapper appearance="custom">
            <HeadingBlock>
              Your Digital Pack subscription is now live
            </HeadingBlock>
          </HeroWrapper>
          <ThankYouContent countryGroupId={props.countryGroupId} />
          <ReturnSection />
        </div>
      );

    case 'thankyou-pending':
      return (
        <div className="thank-you-stage">
          <ThankYouHero
            countryGroupId={props.countryGroupId}
          />
          <HeroWrapper appearance="custom">
            <HeadingBlock>
              Your Digital Pack subscription is being processed
            </HeadingBlock>
          </HeroWrapper>
          <ThankYouPendingContent />
          <ReturnSection />
        </div>
      );


    case 'thankyou-existing':
      return (
        <div className="thank-you-stage">
          <ThankYouHero
            countryGroupId={props.countryGroupId}
          />
          <HeroWrapper appearance="custom">
            <HeadingBlock>
              Your Digital Pack subscription is already live
            </HeadingBlock>
          </HeroWrapper>
          <ThankYouExistingContent countryGroupId={props.countryGroupId} />
          <ReturnSection />
        </div>
      );

    case 'checkout':
    default:
      return (
        <div className="checkout-content">
          <HeroWrapper appearance="custom">
            <HeadingBlock>
              Digital Pack
            </HeadingBlock>
          </HeroWrapper>
          <ProductPageContentBlock>
            <ProductPageTextBlock>
              <LargeParagraph>
                Please enter your details below to complete your Digital Pack subscription.
              </LargeParagraph>
            </ProductPageTextBlock>
            <Divider />
          </ProductPageContentBlock>
          <CheckoutForm />
          {props.formSubmitted ? <ProgressMessage message={['Processing transaction', 'Please wait']} /> : null}
        </div>
      );

  }

}


// ----- Export ----- //

export default connect(mapStateToProps)(CheckoutStage);
