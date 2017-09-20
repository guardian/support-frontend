// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import WayOfSupport from './WayOfSupport';


// ----- Copy ----- //

const generateOnClick = (baseURL: string, intcmp: string): () => void => {
  const params = new URLSearchParams();
  params.append('INTCMP', intcmp);
  const ctaLink = `${baseURL}?${params.toString()}`;

  return () => {
    window.location = ctaLink;
  };
};


const waysOfSupport = [
  {
    heading: 'Patrons',
    infoText: 'The Patron tier is for those who care deeply about the Guardian\'s journalism and the impact it has on the world',
    ctaText: 'Become a Patron',
    ctaLink: 'https://membership.theguardian.com/patrons',
    modifierClass: 'patron',
    gridImg: 'guardianObserverOffice',
    imgAlt: 'the Guardian and the Observer',
  },
  {
    heading: 'Guardian Live events',
    infoText: 'Events, discussions, debates, interviews, festivals, dinners and private views exclusively for Guardian members',
    ctaText: 'Find out about events',
    ctaLink: 'https://membership.theguardian.com/events',
    modifierClass: 'gu-events',
    gridImg: 'liveEvent',
    imgAlt: 'live event',
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

    const onClick = generateOnClick(way.ctaLink, props.intCmp);
    const attrs = Object.assign({}, way, { onClick });

    return <WayOfSupport {...attrs} />;
  });


  return (
    <section className={className}>
      <div className={`${className}__content gu-content-margin`}>
        <div className={`${className}__heading`}>
          <h1>other ways you can support us</h1>
        </div>
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


// ----- Exports ----- //

export default connect(mapStateToProps)(WaysOfSupport);
