// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import FeatureList from 'components/featureList/featureList';
import CtaLink from 'components/ctaLink/ctaLink';
import Bundle from 'components/bundle/bundle';
import ContribAmounts from 'components/contribAmounts/contribAmounts';
import PayPalContributionButton from 'components/payPalContributionButton/payPalContributionButton';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';
import { routes } from 'helpers/routes';
import { contribCamelCase } from 'helpers/contributions';

import type { ListItem } from 'components/featureList/featureList';
import type { Contrib, Amounts, ContribError } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency, Currency } from 'helpers/internationalisation/currency';
import type { Campaign } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Product } from 'pages/bundles-landing/components/Bundles';

import { getDigiPackItems, getPaperItemsForStackedBundle, getPaperDigitalItemsForStackedBundle, inOfferPeriod } from '../helpers/blackFriday';

import CrossProduct from './crossProduct';
import {
  changeContribType,
  changeContribAmount,
  changeContribAmountAnnual,
  changeContribAmountMonthly,
  changeContribAmountOneOff,
} from '../bundlesLandingActions';
import { getSubsLinks } from '../helpers/externalLinks';

import type { SubsUrls } from '../helpers/externalLinks';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  contribType: Contrib,
  contribAmount: Amounts,
  contribError: ContribError,
  intCmp: ?string,
  campaign: ?Campaign,
  otherQueryParams: Array<[string, string]>,
  toggleContribType: (string) => void,
  changeContribAnnualAmount: (string) => void,
  changeContribMonthlyAmount: (string) => void,
  changeContribOneOffAmount: (string) => void,
  changeContribAmount: (string) => void,
  isoCountry: IsoCountry,
  currency: Currency,
  abTests: Participations,
  referrerAcquisitionData: ReferrerAcquisitionData,
  products: Array<Product>
};

type ContribAttrs = {
  heading: string,
  subheading?: string,
  ctaText: string,
  modifierClass: string,
  ctaId: string,
  ctaLink: string,
  ctaAccessibilityHint: string,
  paypalCta?: {
    id: string,
    text: string,
    accessibilityHint: string,
  },
}

type SubscribeAttrs = {
  heading: string,
  subheading: string,
  listItems: ListItem[],
  ctaText: string,
  modifierClass: string,
  ctaId: string,
  ctaLink: string,
  ctaAccessibilityHint: string,
}

/* eslint-enable react/no-unused-prop-types */

type subscribeProductNames = 'digital' | 'paper' | 'paperDigital';

type BundlesType = {
  contrib: {
    oneOff: ContribAttrs,
    monthly: ContribAttrs,
  },
  [subscribeProductNames]: SubscribeAttrs,
}


// ----- Copy ----- //

const oneOffContribCopy: ContribAttrs = {
  heading: '',
  ctaText: 'Contribute with card',
  ctaId: 'contribute',
  modifierClass: 'contributions component-bundle--stacked component-bundle--stacked-one-off',
  ctaLink: '',
  ctaAccessibilityHint: 'Proceed to make a one-off contribution',
  paypalCta: {
    id: 'contribute-paypal',
    text: 'Contribute with PayPal',
    accessibilityHint: 'Proceed to make a one-off contribution with PayPal',
  },
};

const monthlyContribCopy: ContribAttrs = {
  heading: '',
  subheading: 'from £5/month',
  ctaText: 'Contribute with card or PayPal',
  ctaId: 'contribute',
  modifierClass: 'contributions component-bundle--stacked',
  ctaLink: '',
  ctaAccessibilityHint: 'Proceed to make a monthly contribution',
};


const componentBundleModifierClass = `component-bundle--stacked ${inOfferPeriod() ? 'component-bundle--black-friday' : ''}`;

const digitalCopy: SubscribeAttrs = {
  heading: 'digital subscription',
  subheading: '£11.99/month',
  listItems: getDigiPackItems(),
  ctaText: 'Start your 14 day trial',
  ctaId: 'digital-sub',
  modifierClass: `digital ${componentBundleModifierClass}`,
  ctaLink: 'https://subscribe.theguardian.com/uk/digital',
  ctaAccessibilityHint: 'The Guardian\'s digital subscription is available for eleven pounds and ninety nine pence per month. Find out how to sign up for a free trial.',
};

const paperCopy: SubscribeAttrs = {
  heading: 'paper subscription',
  subheading: 'from £10.79/month',
  listItems: getPaperItemsForStackedBundle(),
  ctaText: 'Get a paper subscription',
  ctaId: 'paper-sub structure-test',
  modifierClass: `paper ${componentBundleModifierClass}`,
  ctaLink: 'https://subscribe.theguardian.com/collection/paper',
  ctaAccessibilityHint: 'Proceed to paper subscription options, starting at ten pounds seventy nine pence per month.',
};

const paperDigitalCopy: SubscribeAttrs = {
  heading: 'paper+digital',
  subheading: 'from £22.06/month',
  listItems: getPaperDigitalItemsForStackedBundle(),
  ctaText: 'Get a paper + digital subscription',
  ctaId: 'paper-digi-sub',
  modifierClass: `paperDigital ${componentBundleModifierClass}`,
  ctaLink: 'https://subscribe.theguardian.com/collection/paper-digital',
  ctaAccessibilityHint: 'Proceed to choose which days you would like to regularly receive the newspaper in conjunction with a digital subscription',
};

const bundles: BundlesType = {
  contrib: {
    oneOff: oneOffContribCopy,
    monthly: monthlyContribCopy,
  },
  digital: digitalCopy,
  paper: paperCopy,
  paperDigital: paperDigitalCopy,
};

function getMonthlyContribCopy(abTests: ?Participations) {
  let response = monthlyContribCopy;
  if (abTests && abTests.ukRecurringAmountsTest === 'lower') {
    response = Object.assign({}, monthlyContribCopy, { subheading: 'from £2/month' });
  }
  return response;
}


function getBundles(abTests: ?Participations): BundlesType {
  return {
    contrib: {
      oneOff: oneOffContribCopy,
      monthly: getMonthlyContribCopy(abTests),
    },
    digital: digitalCopy,
    paper: paperCopy,
  };
}

const ctaLinks = {
  annual: routes.recurringContribCheckout,
  monthly: routes.recurringContribCheckout,
  oneOff: routes.oneOffContribCheckout,
  subs: 'https://subscribe.theguardian.com',
};

// ----- Functions ----- //

const getContribAttrs = (
  contribType: Contrib,
  contribAmount: Amounts,
  currency: IsoCurrency,
  isoCountry: string,
  intCmp: ?string,
  abTests: Participations,
): ContribAttrs => {

  const contType = contribCamelCase(contribType);
  const params = new URLSearchParams();

  params.append('contributionValue', contribAmount[contType].value);
  params.append('contribType', contribType);
  params.append('currency', currency);

  if (intCmp !== null && intCmp !== undefined) {
    params.append('INTCMP', intCmp);
  }
  const ctaId = `contribute-${contribType}`;
  const ctaLink = `${ctaLinks[contType]}?${params.toString()}`;
  const localisedOneOffContType = isoCountry === 'us' ? 'one time' : 'one-off';
  const ctaAccessibilityHint = `proceed to make your ${contType.toLowerCase() === 'oneoff' ? localisedOneOffContType : contType.toLowerCase()} contribution`;

  return Object.assign({}, getBundles(abTests).contrib[contType], {
    ctaId, ctaLink, ctaAccessibilityHint,
  });

};

function getPaperAttrs(subsLinks: SubsUrls): SubscribeAttrs {
  return Object.assign({}, bundles.paper, { ctaLink: subsLinks.paper });
}

function getPaperDigitalAttrs(subsLinks: SubsUrls): SubscribeAttrs {
  return Object.assign({}, bundles.paperDigital, { ctaLink: subsLinks.paperDig });
}

function getDigitalAttrs(subsLinks: SubsUrls): SubscribeAttrs {
  return Object.assign({}, bundles.digital, { ctaLink: subsLinks.digital });
}

function ContributionBundle(props: PropTypes) {

  const contribAttrs: ContribAttrs =
    getContribAttrs(
      props.contribType,
      props.contribAmount,
      props.currency.iso,
      props.isoCountry,
      props.intCmp,
      props.abTests,
    );

  const onClick = () => {
    if (!props.contribError) {
      window.location = contribAttrs.ctaLink;
    }
  };

  return (
    <Bundle {...contribAttrs}>
      <p>
        Your contribution funds and supports the&nbsp;Guardian&#39;s journalism.
        All profit is reinvested to safeguard the quality of our journalism.
      </p>
      <ContribAmounts
        onNumberInputKeyPress={onClick}
        {...props}
      />

      <CtaLink
        ctaId={contribAttrs.ctaId.toLowerCase()}
        text={contribAttrs.ctaText}
        accessibilityHint={contribAttrs.ctaAccessibilityHint}
        onClick={onClick}
      />

      {props.contribType === 'ONE_OFF' && !!contribAttrs.paypalCta &&
      <PayPalContributionButton
        buttonText={contribAttrs.paypalCta.text}
        amount={Number(props.contribAmount.oneOff.value)}
        referrerAcquisitionData={props.referrerAcquisitionData}
        isoCountry={props.isoCountry}
        // eslint-disable-next-line no-alert
        errorHandler={e => alert(e)}
        abParticipations={props.abTests}
        additionalClass={props.contribError ? 'contrib-error' : ''}
        canClick={!props.contribError}
      />
      }

      <TermsPrivacy country={props.isoCountry} />

    </Bundle>
  );

}

function SubscribeBundle(props: Object) {
  return (
    <Bundle {...props}>
      <FeatureList listItems={bundles[props.subscriptionProduct].listItems} />
      <CtaLink
        ctaId={props.ctaId}
        text={props.ctaText}
        dataLinkName="bundlesLandingPageDigipackLink"
        accessibilityHint={props.ctaAccessibilityHint}
        url={props.ctaLink}
      />
    </Bundle>
  );

}

// ----- Component ----- //

function StackedBundle(props: PropTypes) {

  const subsLinks: SubsUrls = getSubsLinks(
    props.intCmp,
    props.campaign,
    props.otherQueryParams,
    props.referrerAcquisitionData,
  );
  const digitalAttrs: SubscribeAttrs = getDigitalAttrs(subsLinks);
  const paperAttrs: SubscribeAttrs = getPaperAttrs(subsLinks);
  const paperDigitalAttrs: SubscribeAttrs = getPaperDigitalAttrs(subsLinks);

  const contributions = (
    <div>
      <h2 className="bundles__title">contribute</h2>
      <ContributionBundle {...props} />
    </div>
  );

  const subscriptions = (
    <div>
      <h2 className="bundles__title">subscribe</h2>
      <div className="bundles__divider" />
      <SubscribeBundle {...digitalAttrs} subscriptionProduct="digital" />
      <div className="bundles__divider" />
      <SubscribeBundle {...paperAttrs} subscriptionProduct="paper" />
      <div className="bundles__divider" />
      <SubscribeBundle {...paperDigitalAttrs} subscriptionProduct="paperDigital" />
    </div>
  );

  const hasContributions = props.products.includes('CONTRIBUTE');
  const hasSubscriptions = props.products.includes('PAPER_SUBSCRIPTION')
    && props.products.includes('DIGITAL_SUBSCRIPTION');

  return (
    <section className="bundles bundles--stacked">
      <div className="bundles__content gu-content-margin bundles__content--stacked">
        <div className="bundles__wrapper">
          {hasContributions
            ? contributions
            : null}
          {hasSubscriptions
            ? subscriptions
            : null}
        </div>
      </div>
      <div className="gu-content-margin">
        <CrossProduct />
      </div>
    </section>
  );
}


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    contribType: state.page.type,
    contribAmount: state.page.amount,
    contribError: state.page.error,
    intCmp: state.common.referrerAcquisitionData.campaignCode,
    campaign: state.common.campaign,
    otherQueryParams: state.common.otherQueryParams,
    isoCountry: state.common.country,
    currency: state.common.currency,
    abTests: state.common.abParticipations,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    toggleContribType: (period: Contrib) => {
      dispatch(changeContribType(period));
    },
    changeContribAnnualAmount: (value: string) => {
      dispatch(changeContribAmountAnnual({ value, userDefined: false }));
    },
    changeContribMonthlyAmount: (value: string) => {
      dispatch(changeContribAmountMonthly({ value, userDefined: false }));
    },
    changeContribOneOffAmount: (value: string) => {
      dispatch(changeContribAmountOneOff({ value, userDefined: false }));
    },
    changeContribAmount: (value: string) => {
      dispatch(changeContribAmount({ value, userDefined: true }));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(StackedBundle);
