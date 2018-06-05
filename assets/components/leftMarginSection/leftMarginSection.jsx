// @flow

// ----- Imports ----- //

import React from 'react';

import type { Node } from 'react';


// ----- Props ----- //

type PropTypes = {
  children: Node,
};


// ----- Component ----- //

export default function LeftMarginSection(props: PropTypes) {

  return (
    <section className="component-left-margin-section">
      <div className="component-left-margin-section__content">
        {props.children}
      </div>
    </section>
  );

}
