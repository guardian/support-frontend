// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import FeatureList from 'components/featureList/featureList';
import RadioToggle from 'components/radioToggle/radioToggle';
import CtaLink from 'components/ctaLink/ctaLink';
import Bundle from './Bundle';
import ContribAmounts from './ContribAmounts';
import { changeContribType } from '../actions/bundlesLandingActions';

import type { Contrib, Amounts } from '../reducers/reducers';
import type { Participations } from 'helpers/abtest';

// ----- Types ----- //

type PropTypes = {
  contribType: Contrib,
  contribAmount: Amounts, // eslint-disable-line react/no-unused-prop-types
  intCmp: string, // eslint-disable-line react/no-unused-prop-types
  toggleContribType: (string) => void,
};

type ContribBundle = {
  heading: string,
  subheading: string,
  ctaText: string,
  modifierClass: string,
}

type DigitalBundle = {
  heading: string,
  subheading: string,
  listItems: Array<BundleItem>,
  ctaText: string,
  modifierClass: string,
}

type BundleItem = {
  heading: string,
  text: string,
}

type PaperBundle = {
  heading: string,
  subheading: string,
  listItems: Array<BundleItem>,
  paperCtaText: string,
  paperDigCtaText: string,
  modifierClass: string,
}

type Bundles = {
  contrib: ContribBundle,
  digital: DigitalBundle,
  paper: PaperBundle
}


// ----- Copy ----- //

const ctaLinks = {
  recurring: 'https://membership.theguardian.com/monthly-contribution',
  oneOff: 'https://contribute.theguardian.com/uk',
  paperOnly: 'https://subscribe.theguardian.com/p/GXX83P',
  paperDigital: 'https://subscribe.theguardian.com/p/GXX83X',
  digital: 'https://subscribe.theguardian.com/p/DXX83X',
};

const contribCopy: ContribBundle = {
  heading: 'contribute',
  subheading: 'from £5/month',
  ctaText: 'Contribute with credit/debit card',
  modifierClass: 'contributions',
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
      text: 'Avaliable with paper+digital',
    },
  ],
  paperCtaText: 'Become a paper subscriber',
  paperDigCtaText: 'Become a paper+digital subscriber',
  modifierClass: 'paper',
};

const bundles: Bundles = {
  contrib: contribCopy,
  digital: digitalCopy,
  paper: paperCopy,
  }
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

function getContribAttrs({ contribType, contribAmount, intCmp }): ContribBundle {

  const contType = contribType === 'RECURRING' ? 'recurring' : 'oneOff';
  const amountParam = contType === 'recurring' ? 'contributionValue' : 'amount';
  const params = new URLSearchParams();

  params.append(amountParam, contribAmount[contType].value);
  params.append('INTCMP', intCmp);
  const ctaLink = `${ctaLinks[contType]}?${params.toString()}`;

  return Object.assign({}, bundles.contrib, { ctaLink });

}

function getPaperAttrs({ intCmp }): PaperBundle {

  const params = new URLSearchParams();

  params.append('INTCMP', intCmp);
  const paperCtaLink = `${ctaLinks.paperOnly}?${params.toString()}`;
  const paperDigCtaLink = `${ctaLinks.paperDigital}?${params.toString()}`;

  return Object.assign({}, bundles.paper, { paperCtaLink, paperDigCtaLink });

}

function getDigitalAttrs({ intCmp }): DigitalBundle {

  const params = new URLSearchParams();
  params.append('INTCMP', intCmp);
  const ctaLink = `${ctaLinks.digital}?${params.toString()}`;

  return Object.assign({}, bundles.digital, { ctaLink });

}

const getContributionComponent = (participation: Participations, contribAttrs: ContribBundle) => {

  const variant = participation.SupportFrontEndContribution;

  const getControlVariant = (attrs) => {
    return <Bundle {...attrs}>
      <div className="contrib-type">
        <RadioToggle
          {...contribToggle}
          toggleAction={props.toggleContribType}
          checked={props.contribType}
        />
      </div>
      <ContribAmounts />
      <CtaLink text={attrs.ctaText} url={attrs.ctaLink} />
    </Bundle>
  };

  const getVariantA = (attrs) => {
    return null;
  };

  let response = null;

  switch (variant) {
    case 'control' :
      response = getControlVariant(contribAttrs);
      break;

    case 'variantA' :
      response = getVariantA(contribAttrs);
      break;
    default : response = getControlVariant(contribAttrs);
  }

  return response;
};


// ----- Component ----- //

function Bundles(props: PropTypes) {

  const contribAttrs = getContribAttrs(props);
  const paperAttrs = getPaperAttrs(props);
  const digitalAttrs = getDigitalAttrs(props);

  const contributionComponent = getContributionComponent(props.abTests, contribAttrs);

  return (
    <section className="bundles">
      <div className="bundles__content gu-content-margin">
        <div className="bundles__wrapper">
          <contributionComponent />
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
    intCmp: state.intCmp,
    abTests: state.abTests,
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
