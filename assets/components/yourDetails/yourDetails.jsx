// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import PageSection from 'components/pageSection/pageSection';
import Signout from 'components/signout/signout';
import DisplayName from 'components/displayName/displayName';


// ----- Types ----- //

type PropTypes = {
  children: Node,
};


// ----- Component ----- //

export default function YourDetails(props: PropTypes) {

  return (
    <div className="component-your-details">
      <PageSection heading="Your details" headingChildren={<Signout />}>
        <DisplayName />
        <p className="component-your-details__text">All fields are required.</p>
        {props.children}
      </PageSection>
    </div>
  );

}
