// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import FeatureList from 'components/featureList/featureList';
import RadioToggle from 'components/radioToggle/radioToggle';
import Bundle from './Bundle';
import {
  changePaperBundle,
  changeContribPeriod,
  changeContribAmountMonthly,
  changeContribAmountOneOff,
} from '../actions/bundlesLandingActions';


// ----- Copy ----- //

const bundles = {
  allContrib: {
    heading: 'From £5/month',
    subheading: 'Make a contribution',
    infoText: 'Support the Guardian. Every penny of your contribution goes to support our fearless, quality journalism.',
    ctaText: 'Contribute with credit/debit card',
    modifierClass: 'contributions',
  },
  contribMonthly: {
    ctaLink: '/monthly-contribution',
  },
  contribOneOff: {
    ctaLink: 'https://contribute.theguardian.com/uk',
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
    ctaLink: 'https://subscribe.theguardian.com/p/DXX83X?INTCMP=gdnwb_copts_bundles_landing_default',
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
    ctaLink: 'https://subscribe.theguardian.com/p/GXX83X?INTCMP=gdnwb_copts_bundles_landing_default',
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
    ctaLink: 'https://subscribe.theguardian.com/p/GXX83P?INTCMP=gdnwb_copts_bundles_landing_default',
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
  contribPeriod: {
    name: 'contributions-period-toggle',
    radios: [
      {
        value: 'MONTHLY',
        text: 'Monthly',
      },
      {
        value: 'ONE_OFF',
        text: 'One-off',
      },
    ],
  },
  contribAmount: {
    monthly: {
      name: 'contributions-amount-monthly-toggle',
      radios: [
        {
          value: '5',
          text: '£5',
        },
        {
          value: '10',
          text: '£10',
        },
        {
          value: '20',
          text: '£20',
        },
      ],
    },
    one_off: {
      name: 'contributions-amount-oneoff-toggle',
      radios: [
        {
          value: '25',
          text: '£25',
        },
        {
          value: '50',
          text: '£50',
        },
        {
          value: '100',
          text: '£100',
        },
        {
          value: '250',
          text: '£250',
        },
      ],
    },
  },
};


// ----- Functions ----- //

function getContribAttrs(period) {

  if (period === 'MONTHLY') {
    return Object.assign({}, bundles.allContrib, bundles.contribMonthly);
  }

  return Object.assign({}, bundles.allContrib, bundles.contribOneOff);

}

function getPaperAttrs(bundle) {

  if (bundle === 'PAPER+DIGITAL') {
    return Object.assign({}, bundles.allPaper, bundles.paperDigital);
  }

  return Object.assign({}, bundles.allPaper, bundles.paperOnly);

}


// ----- Component ----- //

function Bundles(props) {

  const paperAttrs = getPaperAttrs(props.paperBundle);
  const contribAttrs = getContribAttrs(props.contribPeriod);
  let contribAmountRadios;

  if (props.contribPeriod === 'MONTHLY') {
    contribAmountRadios = (
      <RadioToggle
        {...toggles.contribAmount.monthly}
        toggleAction={props.toggleContribAmountMonthly}
        checked={props.contribAmount.monthly}
      />
    );
  } else {
    contribAmountRadios = (
      <RadioToggle
        {...toggles.contribAmount.one_off}
        toggleAction={props.toggleContribAmountOneOff}
        checked={props.contribAmount.one_off}
      />
    );
  }

  return (
    <div className="bundles">
      <Bundle {...contribAttrs}>
        <RadioToggle
          {...toggles.contribPeriod}
          toggleAction={props.toggleContribPeriod}
          checked={props.contribPeriod}
        />
        {contribAmountRadios}
      </Bundle>
      <Bundle {...bundles.digital}>
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
    </div>
  );

}


// ----- Proptypes ----- //

Bundles.propTypes = {
  paperBundle: React.PropTypes.string.isRequired,
  contribPeriod: React.PropTypes.string.isRequired,
  contribAmount: React.PropTypes.shape({
    monthly: React.PropTypes.string.isRequired,
    one_off: React.PropTypes.string.isRequired,
  }).isRequired,
  togglePaperBundle: React.PropTypes.func.isRequired,
  toggleContribPeriod: React.PropTypes.func.isRequired,
  toggleContribAmountMonthly: React.PropTypes.func.isRequired,
  toggleContribAmountOneOff: React.PropTypes.func.isRequired,
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {

  return {
    togglePaperBundle: (bundle) => {
      dispatch(changePaperBundle(bundle));
    },
    toggleContribPeriod: (period) => {
      dispatch(changeContribPeriod(period));
    },
    toggleContribAmountMonthly: (amount) => {
      dispatch(changeContribAmountMonthly(amount));
    },
    toggleContribAmountOneOff: (amount) => {
      dispatch(changeContribAmountOneOff(amount));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Bundles);
