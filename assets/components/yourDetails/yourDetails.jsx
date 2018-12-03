// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import PageSection from 'components/pageSection/pageSection';
import Signout from 'components/signout/signout';
import DisplayName from 'components/displayName/displayName';

// ----- Types ----- //

type PropTypes = {|
  name: string,
  isSignedIn: boolean,
  children: Node,
|};

// ----- Component ----- //

function YourDetails(props: PropTypes) {

  return (
    <div className="component-your-details">
      <PageSection heading="Your details" headingChildren={<Signout />}>
        <DisplayName name={props.name} isSignedIn={props.isSignedIn} />
        {props.children}
      </PageSection>
    </div>
  );
}

export default YourDetails;
