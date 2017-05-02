// @flow

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
    modifierClass: 'patron',
  },
  {
    heading: 'Guardian Live events',
    infoText: 'Events, discussions, debates, interviews, festivals, dinners and private views exclusively for Guardian members',
    ctaText: 'Find out about events',
    ctaLink: 'https://membership.theguardian.com/events?INTCMP=gdnwb_copts_bundles_landing_default',
    modifierClass: 'gu-events',
  },
];


// ----- Component ----- //

const WaysOfSupport = () => {

  const className = 'ways-of-support';
  const waysOfSupportRendered = waysOfSupport.map(x => <WayOfSupport {...x} />);

  return (
    <section className={className}>
      <div className={`${className}__content gu-content-margin`}>
        <h1 className={`${className}__heading`}>other ways you can support us</h1>
        {waysOfSupportRendered}
      </div>
    </section>
  );
};

export default WaysOfSupport;
