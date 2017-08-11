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
import type IsoCountry from 'helpers/internationalisation/country';

import {
  changeCountry,
  changeContribType,
  changeContribAmount,
  changeContribAmountRecurring,
  changeContribAmountOneOff,
} from '../actions/bundlesLandingActions';
import getSubsLinks from '../helpers/subscriptionsLinks';

import type { SubsUrls } from '../helpers/subscriptionsLinks';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  isoCountry: IsoCountry,
  contribType: Contrib,
  contribAmount: Amounts,
  contribError: ContribError,
  intCmp: string,
  toggleContribType: (string) => void,
  changeContribRecurringAmount: (string) => void,
  changeContribOneOffAmount: (string) => void,
  changeContribAmount: (string) => void,
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

const contribSubHeadingText = {
    GB: 'from £5/month',
    US: 'from $6.50/month',
};

const digitalSubHeading = {
  GB: '£11.99/month',
  US: '$19.99/month', // source: https://subscribe.theguardian.com/us/digital
};

const paperSubHeading = {
  GB: 'from £22.06/month',
  US: 'from $28.70/month'
};

const digitalCtaLink = {
  GB: 'https://subscribe.theguardian.com/uk/digital',
  US: 'https://subscribe.theguardian.com/us/digital',
};

const contribCopy: ContribAttrs = (isoCountry) => {
    return {
      heading: 'contribute',
      subheading: contribSubheading(isoCountry),
      ctaText: 'Contribute',
      modifierClass: 'contributions',
      ctaLink: '',
    };
};

const digitalCopy: DigitalAttrs = (isoCountry) => {
  return {
    heading: 'digital subscription',
    subheading: digitalSubHeading[isoCountry],
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
    ctaLink: digitalCtaLink[isoCountry],
  };
};

const paperCopy: PaperAttrs = (isoCountry) => {
  return {
    heading: 'paper subscription',
    subheading: paperSubHeading[isoCountry],
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
};

const bundles: BundlesType = (isoCountry) => {
  return {
    contrib: contribCopy(isoCountry),
    digital: digitalCopy(isoCountry),
    paper: paperCopy(isoCountry),
  };
};

const ctaLinks = {
  GB: {
      recurring: 'https://membership.theguardian.com/monthly-contribution',
      oneOff: 'https://contribute.theguardian.com/uk',
      subs: 'https://subscribe.theguardian.com',
  },
  US: {
      recurring: 'https://membership.theguardian.com/monthly-contribution',
      oneOff: 'https://contribute.theguardian.com/us',
      subs: 'https://subscribe.theguardian.com',
  },
};

const contribSubheading = (isoCountry) => {
  return {
    recurring: contribSubHeadingText[isoCountry],
    oneOff: '',
  };
};

// ----- Functions ----- //

const getContribAttrs = ({ isoCountry, contribType, contribAmount, intCmp }): ContribAttrs => {

  const contType = contribType === 'RECURRING' ? 'recurring' : 'oneOff';
  const amountParam = contType === 'recurring' ? 'contributionValue' : 'amount';
  const subheading = contribSubheading(isoCountry)[contType];
  const params = new URLSearchParams();

  params.append(amountParam, contribAmount[contType].value);
  params.append('INTCMP', intCmp);
  const ctaLink = `${ctaLinks[isoCountry][contType]}?${params.toString()}`;

  return Object.assign({}, bundles(isoCountry).contrib, { ctaLink, subheading });

};

function getPaperAttrs(subsLinks: SubsUrls, isoCountry: IsoCountry): PaperAttrs {

  return Object.assign({}, bundles(isoCountry).paper, {
    paperCtaLink: subsLinks.paper,
    paperDigCtaLink: subsLinks.paperDig,
  });

}

function getDigitalAttrs(subsLinks: SubsUrls, isoCountry: IsoCountry): DigitalAttrs {
  return Object.assign({}, bundles(isoCountry).digital, { ctaLink: subsLinks.digital });
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
      <FeatureList listItems={props.listItems} />
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
  const paperAttrs: PaperAttrs = getPaperAttrs(subsLinks, props.isoCountry);
  const digitalAttrs: DigitalAttrs = getDigitalAttrs(subsLinks, props.isoCountry);

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
    isoCountry: state.isoCountry,
    contribType: state.contribution.type,
    contribAmount: state.contribution.amount,
    contribError: state.contribution.error,
    intCmp: state.intCmp,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    setCountryFromDetect: (isoCountry: IsoCountry) => {
      dispatch(changeCountry(isoCountry));
    },
    toggleContribType: (period: Contrib) => {
      dispatch(changeContribType(period));
    },
    changeContribRecurringAmount: (value: string) => {
      dispatch(changeContribAmountRecurring({ value, userDefined: false }));
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
