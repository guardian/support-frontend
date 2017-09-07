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
import { routes } from 'helpers/routes';

import {
  changeContribType,
  changeContribAmount,
  changeContribAmountAnnual,
  changeContribAmountMonthly,
  changeContribAmountOneOff,
} from '../actions/bundlesLandingActions';
import { getSubsLinks } from '../helpers/subscriptionsLinks';

import type { SubsUrls } from '../helpers/subscriptionsLinks';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  contribType: Contrib,
  contribAmount: Amounts,
  contribError: ContribError,
  intCmp: string,
  toggleContribType: (string) => void,
  changeContribAnnualAmount: (string) => void,
  changeContribMonthlyAmount: (string) => void,
  changeContribOneOffAmount: (string) => void,
  changeContribAmount: (string) => void,
  isoCountry: IsoCountry
};

type ContribAttrs = {
  heading: string,
  subheading: string,
  ctaText: string,
  modifierClass: string,
  ctaLink: string,
}

type DigitalAttrs = {
  heading: string,
  subheading: string,
  listItems: ListItem[],
  ctaText: string,
  modifierClass: string,
  ctaLink: string,
}

type PaperAttrs = {
  heading: string,
  subheading: string,
  listItems: ListItem[],
  paperCtaText: string,
  paperDigCtaText: string,
  modifierClass: string,
  paperCtaLink: string,
  paperDigCtaLink: string,
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
  ctaText: 'Contribute',
  modifierClass: 'contributions',
  ctaLink: '',
};

const digitalCopy: DigitalAttrs = {
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
    {
      heading: 'Enjoy on up to 10 devices',
    },
  ],
  ctaText: 'Start your 14 day trial',
  modifierClass: 'digital',
  ctaLink: 'https://subscribe.theguardian.com/uk/digital',
};

const paperCopy: PaperAttrs = {
  heading: 'paper subscription',
  subheading: 'from £22.06/month',
  listItems: [
    {
      heading: 'Newspaper',
      text: 'Choose the package you want: Everyday, Sixday, Weekend and Sunday',
    },
    {
      heading: 'Save money off the retail price',
    },
    {
      heading: 'All the benefits of a digital subscription',
      text: 'Available with paper+digital',
    },
  ],
  paperCtaText: 'Become a paper subscriber',
  paperDigCtaText: 'Become a paper+digital subscriber',
  modifierClass: 'paper',
  paperDigCtaLink: 'https://subscribe.theguardian.com/collection/paper-digital',
  paperCtaLink: 'https://subscribe.theguardian.com/collection/paper',
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

function getContribKey(contribType) {
  switch (contribType) {
    case 'ANNUAL': return 'annual';
    case 'MONTHLY': return 'monthly';
    default: return 'oneOff';
  }
}

const getContribAttrs = ({ contribType, contribAmount, intCmp }): ContribAttrs => {

  const contType = getContribKey(contribType);
  const subheading = contribSubheading[contType];
  const params = new URLSearchParams();

  params.append('contributionValue', contribAmount[contType].value);
  params.append('contribType', contribType);
  params.append('INTCMP', intCmp);
  const ctaLink = `${ctaLinks[contType]}?${params.toString()}`;

  return Object.assign({}, bundles.contrib, { ctaLink, subheading });

};

function getPaperAttrs(subsLinks: SubsUrls): PaperAttrs {

  return Object.assign({}, bundles.paper, {
    paperCtaLink: subsLinks.paper,
    paperDigCtaLink: subsLinks.paperDig,
  });

}

function getDigitalAttrs(subsLinks: SubsUrls): DigitalAttrs {
  return Object.assign({}, bundles.digital, { ctaLink: subsLinks.digital });
}

function ContributionBundle(props: PropTypes) {

  const contribAttrs: ContribAttrs = getContribAttrs(props);

  const onClick = () => {
    if (!props.contribError) {
      window.location = contribAttrs.ctaLink;
    }
  };

  return (
    <Bundle {...contribAttrs}>
      <ContribAmounts
        onNumberInputKeyPress={onClick}
        {...props}
      />
      <CtaLink text={contribAttrs.ctaText} onClick={onClick} />
    </Bundle>
  );

}

function DigitalBundle(props: DigitalAttrs) {

  return (
    <Bundle {...props}>
      <FeatureList listItems={bundles.digital.listItems} />
      <CtaLink text={props.ctaText} url={props.ctaLink} />
    </Bundle>
  );

}

function PaperBundle(props: PaperAttrs) {

  return (
    <Bundle {...props}>
      <FeatureList listItems={props.listItems} />
      <CtaLink text={props.paperCtaText} url={props.paperCtaLink} />
      <CtaLink text={props.paperDigCtaText} url={props.paperDigCtaLink} />
    </Bundle>
  );

}


// ----- Component ----- //

function Bundles(props: PropTypes) {

  const subsLinks: SubsUrls = getSubsLinks(props.intCmp);
  const paperAttrs: PaperAttrs = getPaperAttrs(subsLinks);
  const digitalAttrs: DigitalAttrs = getDigitalAttrs(subsLinks);

  return (
    <section className="bundles">
      <div className="bundles__introduction-bleed-margins" />
      <div className="bundles__content gu-content-margin">
        <div className="bundles__introduction-bleed" />
        <div className="bundles__wrapper">
          <ContributionBundle {...props} />
          <div className="bundles__divider" />
          <DigitalBundle {...digitalAttrs} />
          <div className="bundles__divider" />
          <PaperBundle {...paperAttrs} />
        </div>
      </div>
    </section>
  );
}


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    contribType: state.contribution.type,
    contribAmount: state.contribution.amount,
    contribError: state.contribution.error,
    intCmp: state.page.intCmp,
    isoCountry: state.page.country,
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
