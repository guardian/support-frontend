// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import FeatureList from 'components/featureList/featureList';
import RadioToggle from 'components/radioToggle/radioToggle';
import type { ListItem } from 'components/featureList/featureList';
import CtaLink from 'components/ctaLink/ctaLink';

import Bundle from './Bundle';
import ContribAmounts from './ContribAmounts';
import { changeContribType } from '../actions/bundlesLandingActions';
import getSubsLinks from '../helpers/subscriptionsLinks';

import type { Contrib, Amounts } from '../reducers/reducers';
import type { SubsUrls } from '../helpers/subscriptionsLinks';


// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  contribType: Contrib,
  contribAmount: Amounts,
  contribError: string,
  intCmp: string,
  toggleContribType: (string) => void,
};

/* eslint-enable react/no-unused-prop-types */

type ContribBundle = {
  heading: string,
  subheading: string,
  ctaText: string,
  modifierClass: string,
  ctaLink: string,
}

type DigitalBundle = {
  heading: string,
  subheading: string,
  listItems: ListItem[],
  ctaText: string,
  modifierClass: string,
  ctaLink: string,
}

type PaperBundle = {
  heading: string,
  subheading: string,
  listItems: ListItem[],
  paperCtaText: string,
  paperDigCtaText: string,
  modifierClass: string,
  paperCtaLink: string,
  paperDigCtaLink: string,
}

type BundlesType = {
  contrib: ContribBundle,
  digital: DigitalBundle,
  paper: PaperBundle,
}


// ----- Copy ----- //

const contribCopy: ContribBundle = {
  heading: 'contribute',
  subheading: 'from £5/month',
  ctaText: 'Contribute',
  modifierClass: 'contributions',
  ctaLink: '',
};

const digitalCopy: DigitalBundle = {
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

const paperCopy: PaperBundle = {
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
  recurring: 'https://membership.theguardian.com/monthly-contribution',
  oneOff: 'https://contribute.theguardian.com/uk',
  subs: 'https://subscribe.theguardian.com',
};

const contribSubheading = {
  recurring: 'from £5/month',
  oneOff: '',
};

const contribToggle = {
  name: 'contributions-period-toggle',
  radios: [
    {
      value: 'RECURRING',
      text: 'Monthly',
    },
    {
      value: 'ONE_OFF',
      text: 'One-off',
    },
  ],
};


// ----- Functions ----- //

const getContribAttrs = ({ contribType, contribAmount, intCmp }): ContribBundle => {

  const contType = contribType === 'RECURRING' ? 'recurring' : 'oneOff';
  const amountParam = contType === 'recurring' ? 'contributionValue' : 'amount';
  const subheading = contribSubheading[contType];
  const params = new URLSearchParams();

  params.append(amountParam, contribAmount[contType].value);
  params.append('INTCMP', intCmp);
  const ctaLink = `${ctaLinks[contType]}?${params.toString()}`;

  return Object.assign({}, bundles.contrib, { ctaLink, subheading });

};

function getPaperAttrs(subsLinks: SubsUrls): PaperBundle {

  return Object.assign({}, bundles.paper, {
    paperCtaLink: subsLinks.paper,
    paperDigCtaLink: subsLinks.paperDig,
  });

}

function getDigitalAttrs(subsLinks: SubsUrls): DigitalBundle {
  return Object.assign({}, bundles.digital, { ctaLink: subsLinks.digital });
}

const getContributionComponent = (props: PropTypes, attrs: ContribBundle) => {

  const onClick = () => {
    if (!props.contribError) {
      window.location = attrs.ctaLink;
    }
  };

  return (
    <Bundle {...attrs}>
      <div className="contrib-type">
        <RadioToggle
          {...contribToggle}
          toggleAction={props.toggleContribType}
          checked={props.contribType}
        />
      </div>
      <ContribAmounts onNumberInputKeyPress={onClick} />
      <CtaLink text={attrs.ctaText} onClick={onClick} />
    </Bundle>
  );
};

// ----- Component ----- //

function Bundles(props: PropTypes) {

  const contribAttrs: ContribBundle = getContribAttrs(props);
  const subsLinks: SubsUrls = getSubsLinks(props.intCmp);
  const paperAttrs: PaperBundle = getPaperAttrs(subsLinks);
  const digitalAttrs: DigitalBundle = getDigitalAttrs(subsLinks);
  const contributionComponent = getContributionComponent(props, contribAttrs);

  return (
    <section className="bundles">
      <div className="bundles__introduction-bleed-margins" />
      <div className="bundles__content gu-content-margin">
        <div className="bundles__introduction-bleed" />
        <div className="bundles__wrapper">
          {contributionComponent}
          <div className="bundles__divider" />
          <Bundle {...digitalAttrs}>
            <FeatureList listItems={bundles.digital.listItems} />
            <CtaLink text={digitalAttrs.ctaText} url={digitalAttrs.ctaLink} />
          </Bundle>
          <div className="bundles__divider" />
          <Bundle {...paperAttrs}>
            <FeatureList listItems={paperAttrs.listItems} />
            <CtaLink text={paperAttrs.paperCtaText} url={paperAttrs.paperCtaLink} />
            <CtaLink text={paperAttrs.paperDigCtaText} url={paperAttrs.paperDigCtaLink} />
          </Bundle>
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
    intCmp: state.intCmp,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    toggleContribType: (period: Contrib) => {
      dispatch(changeContribType(period));
    },
  };

}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Bundles);
