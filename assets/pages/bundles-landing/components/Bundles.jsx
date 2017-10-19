// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import FeatureList from 'components/featureList/featureList';
import type { ListItem } from 'components/featureList/featureList';
import CtaLink from 'components/ctaLink/ctaLink';
import Bundle from 'components/bundle/bundle';
import ContribAmounts from 'components/contribAmounts/contribAmounts';
import type { Contrib, Amounts, ContribError } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Campaign } from 'helpers/tracking/acquisitions';
import { routes } from 'helpers/routes';

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
import type { Participations } from '../../../helpers/abtest';


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
  abTests: Participations,
};

type ContribAttrs = {
  heading: string,
  subheading: string,
  ctaText: string,
  modifierClass: string,
  ctaId: string,
  ctaLink: string,
  ctaAccessibilityHint: string,
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
  contrib: ContribAttrs,
  digital: DigitalAttrs,
  paper: PaperAttrs,
}


// ----- Copy ----- //

const contribCopy: ContribAttrs = {
  heading: 'contribute',
  subheading: 'from £5/month',
  ctaText: 'Contribute with card or PayPal',
  ctaId: 'contribute',
  modifierClass: 'contributions',
  ctaLink: '',
  ctaAccessibilityHint: 'Proceed to make your chosen contribution',
};

const digitalCopy: DigitalAttrs = {
  heading: 'digital subscription',
  subheading: '£11.99/month',
  listItems: [
    {
      heading: 'Premium experience on the Guardian app',
      text: 'No adverts means faster loading pages and a clearer reading experience. Play our daily crosswords offline wherever you are',
    },
    {
      heading: 'Daily Tablet Edition app',
      text: 'Read the Guardian, the Observer and all the Weekend supplements in an optimised tablet app; available on iPad, Android and Kindle Fire tablets',
    },
  ],
  ctaText: 'Start your free trial',
  ctaId: 'start-digi-trial',
  modifierClass: 'digital',
  ctaLink: 'https://subscribe.theguardian.com/uk/digital',
  ctaAccessibilityHint: 'The Guardian\'s digital subscription is available for eleven pounds and ninety nine pence per month. Find out how to sign up for a free trial.',
};

const paperCopy: PaperAttrs = {
  heading: 'paper subscription',
  subheading: 'from £10.79/month',
  listItems: [
    {
      heading: 'Choose your package and delivery method',
      text: 'Everyday, Sixday, Weekend and Sunday; redeem paper vouchers or get home delivery',
    },
    {
      heading: 'Save money on the retail price',
    },
    {
      heading: 'Get all the benefits of a digital subscription with paper+digital',
    },
  ],
  paperCtaText: 'Get a paper subscription',
  paperDigCtaText: 'Get a paper+digital subscription',
  modifierClass: 'paper',
  paperDigCtaId: 'paper-digi-sub',
  paperDigCtaLink: 'https://subscribe.theguardian.com/collection/paper-digital',
  paperDigCtaAccessibilityHint: 'Proceed to choose which paper you would like to receive regularly in conjunction with a digital subscription',
  paperCtaId: 'paper-sub',
  paperCtaLink: 'https://subscribe.theguardian.com/collection/paper',
  paperCtaAccessibilityHint: 'Proceed to paper subscription options, starting at ten pounds seventy nine pence per month.',
};

const bundles: BundlesType = {
  contrib: contribCopy,
  digital: digitalCopy,
  paper: paperCopy,
};

const ctaLinks = {
  annual: routes.recurringContribCheckout,
  monthly: routes.recurringContribCheckout,
  oneOff: routes.oneOffContribCheckout,
  subs: 'https://subscribe.theguardian.com',
};

const contribSubheading = {
  annual: 'from £50/year',
  monthly: 'from £5/month',
  oneOff: '',
};


// ----- Functions ----- //

function getContribKey(contribType: Contrib) {
  switch (contribType) {
    case 'ANNUAL': return 'annual';
    case 'MONTHLY': return 'monthly';
    default: return 'oneOff';
  }
}

const getContribAttrs = (
  contribType: Contrib,
  contribAmount: Amounts,
  intCmp: ?string,
  isoCountry: string): ContribAttrs => {

  const contType = getContribKey(contribType);
  const subheading = contribSubheading[contType];
  const params = new URLSearchParams();

  params.append('contributionValue', contribAmount[contType].value);
  params.append('contribType', contribType);

  if (intCmp !== null && intCmp !== undefined) {
    params.append('INTCMP', intCmp);
  }
  const ctaId = `contribute-${contribType}`;
  const ctaLink = `${ctaLinks[contType]}?${params.toString()}`;
  const localisedOneOffContType = isoCountry === 'us' ? 'one time' : 'one-off';
  const ctaAccessibilityHint = `proceed to make your ${contType.toLowerCase() === 'oneoff' ? localisedOneOffContType : contType.toLowerCase()} contribution`;
  return Object.assign({}, bundles.contrib, { ctaId, ctaLink, subheading, ctaAccessibilityHint });

};

function getPaperAttrs(subsLinks: SubsUrls): PaperAttrs {

  return Object.assign({}, bundles.paper, {
    paperCtaId: 'paper-sub',
    paperCtaLink: subsLinks.paper,
    paperDigCtaId: 'paper-digital-sub',
    paperDigCtaLink: subsLinks.paperDig,
  });

}

function getDigitalAttrs(subsLinks: SubsUrls): DigitalAttrs {
  return Object.assign({}, bundles.digital, { ctaLink: subsLinks.digital });
}

function ContributionBundle(props: PropTypes) {

  const contribAttrs: ContribAttrs =
    getContribAttrs(
      props.contribType,
      props.contribAmount,
      props.intCmp,
      props.isoCountry,
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
    </Bundle>
  );

}

function DigitalBundle(props: DigitalAttrs) {

  return (
    <Bundle {...props}>
      <FeatureList listItems={bundles.digital.listItems} />
      <CtaLink
        ctaId={props.ctaId}
        text={props.ctaText}
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

  const subsLinks: SubsUrls = getSubsLinks(props.intCmp, props.campaign, props.otherQueryParams);
  const paperAttrs: PaperAttrs = getPaperAttrs(subsLinks);
  const digitalAttrs: DigitalAttrs = getDigitalAttrs(subsLinks);

  return (
    <section className="bundles">
      <div className="bundles__content gu-content-margin">
        <div className="bundles__wrapper">
          <ContributionBundle {...props} />
          <div className="bundles__divider" />
          <DigitalBundle {...digitalAttrs} />
          <div className="bundles__divider" />
          <PaperBundle {...paperAttrs} />
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
    abTests: state.common.abParticipations,
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
