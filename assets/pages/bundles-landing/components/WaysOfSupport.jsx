// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import WayOfSupport from './WayOfSupport';


// ----- Copy ----- //

const waysOfSupport = [
  {
    heading: 'Patrons',
    infoText: 'The Patrons tier for those who care deeply about the the Guardian\'s journalism and the imact is has on th world',
    ctaText: 'Become a Patron',
    ctaLink: 'https://membership.theguardian.com/patrons',
    modifierClass: 'patron',
  },
  {
    heading: 'Guardian Live events',
    infoText: 'Events, discussions, debates, interviews, festivals, dinners and private views exclusively for Guardian members',
    ctaText: 'Find out about events',
    ctaLink: 'https://membership.theguardian.com/events',
    modifierClass: 'gu-events',
  },
];

type PropTypes = {
  intCmp: string,
};


// ----- Component ----- //

const WaysOfSupport = (props: PropTypes) => {

  const className = 'ways-of-support';

  const params = new URLSearchParams();
  params.append('INTCMP', props.intCmp);


  const waysOfSupportRendered = waysOfSupport.map((way) => {

    const ctaLink = `${way.ctaLink}?${params.toString()}`;
    const attrs = Object.assign({}, way, { ctaLink });
    return <WayOfSupport {...attrs} />;

  });

  return (
    <section className={className}>
      <div className={`${className}__content gu-content-margin`}>
        <h1 className={`${className}__heading`}>other ways you can support us</h1>
        {waysOfSupportRendered}
      </div>
    </section>
  );
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    intCmp: state.intCmp,
  };
}


export default connect(mapStateToProps)(WaysOfSupport);
