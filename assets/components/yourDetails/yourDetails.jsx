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

export default function YourContribution(props: PropTypes) {

  return (
    <PageSection heading="Your details" headingChildren={<Signout />}>
      <DisplayName />
      {props.children}
    </PageSection>
  );

}
