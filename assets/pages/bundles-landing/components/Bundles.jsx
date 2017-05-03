// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import FeatureList from 'components/featureList/featureList';
import RadioToggle from 'components/radioToggle/radioToggle';
import Bundle from './Bundle';
import ContribAmounts from './ContribAmounts';
import {
  changePaperBundle,
  changeContribType,
} from '../actions/bundlesLandingActions';

import type { Contrib, Amounts, PaperBundle } from '../reducers/reducers';


// ----- Copy ----- //

const ctaLinks = {
  recurring: '/monthly-contribution',
  oneOff: 'https://contribute.theguardian.com/uk',
  paperOnly: 'https://subscribe.theguardian.com/p/GXX83P',
  paperDigital: 'https://subscribe.theguardian.com/p/GXX83X',
  digital: 'https://subscribe.theguardian.com/p/DXX83X',
};

const bundles = {
  allContrib: {
    heading: 'From £5/month',
    subheading: 'Make a contribution',
    infoText: 'Support the Guardian. Every penny of your contribution goes to support our fearless, quality journalism.',
    ctaText: 'Contribute with credit/debit card',
    modifierClass: 'contributions',
  },
  digital: {
    heading: '£11.99/month',
    subheading: 'Become a digital subscriber',
    listItems: [
      {
        heading: 'Ad-free mobile app',
        text: 'Faster pages and a clearer reading experience',
      },
      {
        heading: 'Daily tablet edition',
        text: 'Daily newspaper optimised for tablet; available on Apple, Android and Kindle Fire',
      },
      {
        heading: 'Free trial',
        text: 'For 14 days, enjoy on up to 10 devices',
      },
    ],
    infoText: 'Support the Guardian and enjoy a subscription to our digital Daily Edition and the premium tier of our app.',
    ctaText: 'Become a digital subscriber',
    modifierClass: 'digital',
  },
  allPaper: {
    subheading: 'Become a paper subscriber',
    infoText: 'Support the Guardian and enjoy a subscription to the Guardian and the Observer newspapers.',
    ctaText: 'Become a paper subscriber',
    modifierClass: 'paper',
  },
  paperDigital: {
    heading: 'From £22.06/month',
    listItems: [
      {
        heading: 'Newspaper',
        text: 'Choose the package you want: Everyday+, Sixday+, Weekend+ and Sunday+',
      },
      {
        heading: 'Digital',
        text: 'All the benefits of the digital subscription',
      },
      {
        heading: 'Save money',
        text: 'Up to 36% off the retail price',
      },
    ],
  },
  paperOnly: {
    heading: 'From £10.79/month',
    listItems: [
      {
        heading: 'Newspaper',
        text: 'Choose the package you want: Everyday+, Sixday+, Weekend+ and Sunday+',
      },
      {
        heading: 'Save money',
        text: 'Up to 36% off the retail price',
      },
    ],
  },
};

const toggles = {
  paper: {
    name: 'paper-toggle',
    radios: [
      {
        value: 'PAPER+DIGITAL',
        text: 'Paper + digital',
      },
      {
        value: 'PAPER',
        text: 'Paper',
      },
    ],
  },
  contribType: {
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
  },
};


// ----- Types ----- //

type PropTypes = {
  paperBundle: PaperBundle,
  contribType: Contrib,
  contribAmount: Amounts, // eslint-disable-line react/no-unused-prop-types
  intCmp: string, // eslint-disable-line react/no-unused-prop-types
  togglePaperBundle: (string) => void,
  toggleContribType: (string) => void,
};


// ----- Functions ----- //

function getContribAttrs({ contribType, contribAmount, intCmp }) {

  const contType = contribType === 'RECURRING' ? 'recurring' : 'oneOff';
  const amountParam = contType === 'recurring' ? 'contributionValue' : 'amount';
  const params = new URLSearchParams();

  params.append(amountParam, contribAmount[contType].value);
  params.append('INTCMP', intCmp);
  const ctaLink = `${ctaLinks[contType]}?${params.toString()}`;

  return Object.assign({}, bundles.allContrib, { ctaLink });

}

function getPaperAttrs({ paperBundle, intCmp }) {

  let ctaLink = null;
  let selectedBundle = null;
  const params = new URLSearchParams();

  params.append('INTCMP', intCmp);

  if (paperBundle === 'PAPER+DIGITAL') {
    ctaLink = `${ctaLinks.paperDigital}?${params.toString()}`;
    selectedBundle = bundles.paperDigital;
  } else {
    ctaLink = `${ctaLinks.paperOnly}?${params.toString()}`;
    selectedBundle = bundles.paperOnly;
  }

  return Object.assign({}, bundles.allPaper, selectedBundle, { ctaLink });
}

function getDigitalAttrs({ intCmp }) {

  const params = new URLSearchParams();
  params.append('INTCMP', intCmp);
  const ctaLink = `${ctaLinks.digital}?${params.toString()}`;

  return Object.assign({}, bundles.digital, { ctaLink });
}


// ----- Component ----- //

function Bundles(props: PropTypes) {

  const contribAttrs = getContribAttrs(props);
  const paperAttrs = getPaperAttrs(props);
  const digitalAttrs = getDigitalAttrs(props);

  return (
    <section className="bundles gu-content-margin">
      <Bundle {...contribAttrs}>
        <RadioToggle
          {...toggles.contribType}
          toggleAction={props.toggleContribType}
          checked={props.contribType}
        />
        <ContribAmounts />
      </Bundle>
      <Bundle {...digitalAttrs}>
        <FeatureList listItems={bundles.digital.listItems} />
      </Bundle>
      <Bundle {...paperAttrs}>
        <RadioToggle
          {...toggles.paper}
          toggleAction={props.togglePaperBundle}
          checked={props.paperBundle}
        />
        <FeatureList listItems={paperAttrs.listItems} />
      </Bundle>
    </section>
  );

}


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    paperBundle: state.paperBundle,
    contribType: state.contribution.type,
    contribAmount: state.contribution.amount,
    intCmp: state.intCmp,
  };
}

function mapDispatchToProps(dispatch) {

  return {
    togglePaperBundle: (bundle: PaperBundle) => {
      dispatch(changePaperBundle(bundle));
    },
    toggleContribType: (period: Contrib) => {
      dispatch(changeContribType(period));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Bundles);
