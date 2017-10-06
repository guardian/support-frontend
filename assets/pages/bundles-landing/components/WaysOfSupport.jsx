// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { getMemLink } from '../helpers/externalLinks';
import WayOfSupport from './WayOfSupport';

import type { MemProduct } from '../helpers/externalLinks';


// ----- Copy ----- //

function generateOnClick(product: MemProduct, intCmp: ?string): () => void {

  return () => {
    window.location = getMemLink(product, intCmp);
  };

}

const waysOfSupport = [
  {
    heading: 'Patrons',
    infoText: 'The Patron tier is for those who want a deeper relationship with the Guardian and its journalists',
    ctaText: 'Find out more',
    product: 'patrons',
    modifierClass: 'patron',
    gridImg: '137d6b217a27acddf85512657d04f6490b9e0bb1/1638_0_3571_2009',
    imgAlt: 'the Guardian and the Observer',
  },
  {
    heading: 'Guardian Live events',
    infoText: 'Meet Guardian journalists and readers at our events, debates, interviews and festivals',
    ctaText: 'Find out about events',
    product: 'events',
    modifierClass: 'gu-events',
    gridImg: '5f18c6428e9f31394b14215fe3c395b8f7b4238a/500_386_2373_1335',
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

    const onClick = generateOnClick(way.product, props.intCmp);
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
    intCmp: state.common.acquisition.campaignCode,
  };
}


// ----- Exports ----- //

export default connect(mapStateToProps)(WaysOfSupport);
