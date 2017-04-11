// ----- Imports ----- //

import React from 'react';

import WayOfSupport from './WayOfSupport';


// ----- Copy ----- //

const waysOfSupport = [
  {
    heading: 'Patrons',
    infoText: 'The Patrons tier for those who care deeply about the the Guardian\'s journalism and the imact is has on th world',
    ctaText: 'Become a Patron',
    ctaLink: 'https://membership.theguardian.com/patrons?INTCMP=gdnwb_copts_bundles_landing_default',
  },
  {
    heading: 'Guardian Live events',
    infoText: 'Events, discussions, debates, interviews, festivals, dinners and private views exclusively for Guardian members',
    ctaText: 'Find out about events',
    ctaLink: 'https://membership.theguardian.com/events?INTCMP=gdnwb_copts_bundles_landing_default',
  },
];


// ----- Component ----- //

const WaysOfSupport = () => {

  const waysOfSupportRendered = waysOfSupport.map(x => <WayOfSupport {...x} />);

  return (
    <div className="ways-of-support">
      {waysOfSupportRendered}
    </div>
  );
};

export default WaysOfSupport;

