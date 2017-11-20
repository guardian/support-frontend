// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import FeatureList from 'components/featureList/featureList';
import CtaLink from 'components/ctaLink/ctaLink';
import Bundle from 'components/bundle/bundle';
import ContribAmounts from 'components/contribAmounts/contribAmounts';
import PayPalContributionButton from 'components/payPalContributionButton/payPalContributionButton';
import { routes } from 'helpers/routes';
import { contribCamelCase } from 'helpers/contributions';

import type { ListItem } from 'components/featureList/featureList';
import type { Contrib, Amounts, ContribError } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency, Currency } from 'helpers/internationalisation/currency';
import type { Campaign } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abtest';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

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
  heading: 'contribute',
  ctaText: 'Contribute with card',
  ctaId: 'contribute',
  modifierClass: 'contributions',
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
  modifierClass: 'contributions structureTest',
  ctaLink: '',
  ctaAccessibilityHint: 'Proceed to make a monthly contribution',
};

const digitalCopy: SubscribeAttrs = {
  heading: 'digital subscription',
  subheading: '£11.99/month',
  listItems: [
    {
      heading: 'Ad-free mobile app',
      text: 'No interruptions means pages load quicker for a clearer reading experience',
    },
    {
      heading: 'Daily tablet edition',
      text: 'Daily newspaper optimised for tablet; available on Apple, Android and Kindle Fire',
    },
  ],
  ctaText: 'Start your 14 day trial',
  ctaId: 'digital-sub',
  modifierClass: 'digital  structureTest',
  ctaLink: 'https://subscribe.theguardian.com/uk/digital',
  ctaAccessibilityHint: 'The Guardian\'s digital subscription is available for eleven pounds and ninety nine pence per month. Find out how to sign up for a free trial.',
};

const paperCopy: SubscribeAttrs = {
  heading: 'paper subscription',
  subheading: 'from £10.79/month',
  listItems: [
    {
      heading: 'Newspaper',
      text: 'and delivery method: Everyday, Sixday, Weekend and Sunday; redeem paper vouchers or get home delivery',
    },
    {
      heading: 'Save money on the retail price',
    },
  ],
  ctaText: 'Get a paper subscription',
  ctaId: 'paper-sub structure-test',
  modifierClass: 'paper structureTest',
  ctaLink: 'https://subscribe.theguardian.com/collection/paper',
  ctaAccessibilityHint: 'Proceed to paper subscription options, starting at ten pounds seventy nine pence per month.',
};

const paperDigitalCopy: SubscribeAttrs = {
  heading: 'paper+digital',
  subheading: 'from £22.06/month',
  listItems: [
    {
      heading: 'Newspaper',
      text: 'Choose the package you want: Everyday, Sixday, Weekend and Sunday',
    },
    {
      heading: 'Save money on the retail price',
      text: 'Daily newspaper optimised for tablet; available on Apple, Android and Kindle Fire',
    },
    {
      heading: 'Get all the digital benefits',
    },
  ],
  ctaText: 'Get a paper + digital subscription',
  ctaId: 'paper-digi-sub',
  modifierClass: 'paperDigital structureTest',
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

  return Object.assign({}, bundles.contrib[contType], {
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
    );

  const onClick = () => {
    if (!props.contribError) {
      window.location = contribAttrs.ctaLink;
    }
  };

  return (
    <Bundle {...contribAttrs}>
      <p>
        Your contribution funds and supports the&nbsp;Guardian&#39;s journalism
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

function BundlesGBStructureTest(props: PropTypes) {

  const subsLinks: SubsUrls = getSubsLinks(
    props.intCmp,
    props.campaign,
    props.otherQueryParams,
    props.abTests,
    props.referrerAcquisitionData,
  );
  const digitalAttrs: SubscribeAttrs = getDigitalAttrs(subsLinks);
  const paperAttrs: SubscribeAttrs = getPaperAttrs(subsLinks);
  const paperDigitalAttrs: SubscribeAttrs = getPaperDigitalAttrs(subsLinks);

  return (
    <section className="bundles">
      <div className="bundles__content gu-content-margin">
        <div className="bundles__wrapper">
          <h2>contribute</h2>
          <ContributionBundle {...props} />
        </div>
        <div className="bundles__wrapper">
          <h2>subscribe</h2>
          <div className="bundles__divider" />
          <SubscribeBundle {...digitalAttrs} subscriptionProduct="digital" />
          <div className="bundles__divider" />
          <SubscribeBundle {...paperAttrs} subscriptionProduct="paper" />
          <div className="bundles__divider" />
          <SubscribeBundle {...paperDigitalAttrs} subscriptionProduct="paperDigital" />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BundlesGBStructureTest);
