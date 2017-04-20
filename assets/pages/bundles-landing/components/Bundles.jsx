// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import FeatureList from 'components/featureList/featureList';
import RadioToggle from 'components/radioToggle/radioToggle';
import Bundle from './Bundle';
import changePaperBundle from '../actions/bundlesLandingActions';


// ----- Copy ----- //

const bundles = {
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
  paperDigital: {
    heading: 'From £22.06/month',
    subheading: 'Become a paper subscriber',
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
    infoText: 'Support the Guardian and enjoy a subscription to the Guardian and the Observer newspapers.',
    ctaText: 'Become a paper subscriber',
    ctaLink: 'https://subscribe.theguardian.com/p/GXX83X?INTCMP=gdnwb_copts_bundles_landing_default',
    modifierClass: 'paper',
  },
  paperOnly: {
    heading: 'From £10.79/month',
    subheading: 'Become a paper subscriber',
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
    infoText: 'Support the Guardian and enjoy a subscription to the Guardian and the Observer newspapers.',
    ctaText: 'Become a paper subscriber',
    ctaLink: 'https://subscribe.theguardian.com/p/GXX83P?INTCMP=gdnwb_copts_bundles_landing_default',
    modifierClass: 'paper',
  },
};

const paperToggles = {
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
};


// ----- Functions ----- //

function getPaperAttrs(bundle) {

  if (bundle === 'PAPER+DIGITAL') {
    return bundles.paperDigital;
  }

  return bundles.paperOnly;

}


// ----- Component ----- //

function Bundles(props) {

  const paperAttrs = getPaperAttrs(props.paperBundle);

  function togglePaperBundle(bundle) {
    return () => props.dispatch(changePaperBundle(bundle));
  }

  return (
    <section className="bundles gu-content-margin">
      <Bundle {...bundles.digital}>
        <FeatureList listItems={bundles.digital.listItems} />
      </Bundle>
      <Bundle {...paperAttrs}>
        <RadioToggle
          {...paperToggles}
          toggleAction={togglePaperBundle}
          checked={props.paperBundle}
        />
        <FeatureList listItems={paperAttrs.listItems} />
      </Bundle>
    </section>
  );

}


// ----- Proptypes ----- //

Bundles.propTypes = {
  paperBundle: React.PropTypes.string.isRequired,
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return { paperBundle: state };
}


// ----- Exports ----- //

export default connect(mapStateToProps)(Bundles);
