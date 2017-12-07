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
import { getDigiPackItems, getPaperItems } from '../helpers/blackFriday';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type Product = 'CONTRIBUTE' | 'DIGITAL_SUBSCRIPTION' | 'PAPER_SUBSCRIPTION';

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

type DigitalAttrs = {
  heading: string,
  subheading: string,
  listItems: ListItem[],
  ctaText: string,
  modifierClass: string,
  ctaId: string,
  ctaLink: string,
  ctaAccessibilityHint: string,
}

type PaperAttrs = {
  heading: string,
  subheading: string,
  listItems: ListItem[],
  paperCtaText: string,
  paperDigCtaText: string,
  modifierClass: string,
  paperCtaId: string,
  paperCtaLink: string,
  paperCtaAccessibilityHint: string,
  paperDigCtaId: string,
  paperDigCtaLink: string,
  paperDigCtaAccessibilityHint: string,
}

/* eslint-enable react/no-unused-prop-types */

type BundlesType = {
  contrib: {
    oneOff: ContribAttrs,
    monthly: ContribAttrs,
    annual: ContribAttrs,
  },
  digital: DigitalAttrs,
  paper: PaperAttrs,
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
  heading: 'contribute',
  subheading: 'from £5/month',
  ctaText: 'Contribute with card or PayPal',
  ctaId: 'contribute',
  modifierClass: 'contributions',
  ctaLink: '',
  ctaAccessibilityHint: 'Proceed to make a monthly contribution',
};

const monthlyContribCopyTwo: ContribAttrs = {
  heading: 'contribute',
  subheading: 'from £2/month',
  ctaText: 'Contribute with card or PayPal',
  ctaId: 'contribute',
  modifierClass: 'contributions',
  ctaLink: '',
  ctaAccessibilityHint: 'Proceed to make a monthly contribution',
};

function getMonthlyContribCopy(abTests: ?Participations) {
  if (abTests) {
    return abTests.ukRecurringAmountsTest === 'lower'
      ? monthlyContribCopyTwo
      : monthlyContribCopy;
  }
  return monthlyContribCopy;
}

const annualContribCopy: ContribAttrs = {
  heading: 'contribute',
  subheading: 'from £50/year',
  ctaText: 'Contribute with card or PayPal',
  ctaId: 'contribute',
  modifierClass: 'contributions',
  ctaLink: '',
  ctaAccessibilityHint: 'Proceed to make an annual contribution',
};

const digitalCopy: DigitalAttrs = {
  heading: 'digital subscription',
  subheading: '£11.99/month',
  listItems: getDigiPackItems(),
  ctaText: 'Start your free trial',
  ctaId: 'start-digi-trial',
  modifierClass: 'digital',
  ctaLink: 'https://subscribe.theguardian.com/uk/digital',
  ctaAccessibilityHint: 'The Guardian\'s digital subscription is available for eleven pounds and ninety nine pence per month. Find out how to sign up for a free trial.',
};

const paperCopy: PaperAttrs = {
  heading: 'paper subscription',
  subheading: 'from £10.79/month',
  listItems: getPaperItems(),
  paperCtaText: 'Get a paper subscription',
  paperDigCtaText: 'Get a paper+digital subscription',
  modifierClass: 'paper',
  paperDigCtaId: 'paper-digi-sub',
  paperDigCtaLink: 'https://subscribe.theguardian.com/collection/paper-digital',
  paperDigCtaAccessibilityHint: 'Proceed to choose which days you would like to regularly receive the newspaper in conjunction with a digital subscription',
  paperCtaId: 'paper-sub',
  paperCtaLink: 'https://subscribe.theguardian.com/collection/paper',
  paperCtaAccessibilityHint: 'Proceed to paper subscription options, starting at ten pounds seventy nine pence per month.',
};

function bundles(abTests: ?Participations): BundlesType {
  return {
    contrib: {
      oneOff: oneOffContribCopy,
      monthly: getMonthlyContribCopy(abTests),
      annual: annualContribCopy,
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

  return Object.assign({}, bundles(abTests).contrib[contType], {
    ctaId, ctaLink, ctaAccessibilityHint,
  });

};

function getPaperAttrs(subsLinks: SubsUrls): PaperAttrs {

  return Object.assign({}, bundles().paper, {
    paperCtaId: 'paper-sub',
    paperCtaLink: subsLinks.paper,
    paperDigCtaId: 'paper-digital-sub',
    paperDigCtaLink: subsLinks.paperDig,
  });

}

function getDigitalAttrs(subsLinks: SubsUrls): DigitalAttrs {
  return Object.assign({}, bundles().digital, { ctaLink: subsLinks.digital });
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
      <TermsPrivacy country={props.isoCountry} />
    </Bundle>
  );

}

function DigitalBundle(props: DigitalAttrs) {

  return (
    <Bundle {...props}>
      <FeatureList listItems={bundles().digital.listItems} />
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

function PaperBundle(props: PaperAttrs) {

  return (
    <Bundle {...props}>
      <FeatureList listItems={props.listItems} />
      <CtaLink
        ctaId={props.paperCtaId}
        text={props.paperCtaText}
        accessibilityHint={props.paperCtaAccessibilityHint}
        url={props.paperCtaLink}
      />
      <CtaLink
        ctaId={props.paperDigCtaId}
        text={props.paperDigCtaText}
        accessibilityHint={props.paperDigCtaAccessibilityHint}
        url={props.paperDigCtaLink}
      />
    </Bundle>
  );

}


// ----- Component ----- //

function Bundles(props: PropTypes) {

  const subsLinks: SubsUrls = getSubsLinks(
    props.intCmp,
    props.campaign,
    props.otherQueryParams,
    props.referrerAcquisitionData,
  );
  const paperAttrs: PaperAttrs = getPaperAttrs(subsLinks);
  const digitalAttrs: DigitalAttrs = getDigitalAttrs(subsLinks);

  return (
    <section className="bundles">
      <div className="bundles__content gu-content-margin">
        <div className={`bundles__wrapper bundles__wrapper--${props.products.length}`}>
          {props.products.map(p => {
            if (p === 'PAPER_SUBSCRIPTION') return <PaperBundle {...paperAttrs} />;
            if (p === 'DIGITAL_SUBSCRIPTION') return <DigitalBundle {...digitalAttrs} />;
            if (p === 'CONTRIBUTE') return <ContributionBundle {...props} />;
          })}
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

export default connect(mapStateToProps, mapDispatchToProps)(Bundles);
