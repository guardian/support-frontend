// @flow

// ----- Imports ----- //

import React from 'react';

import ThreeSubscriptionsContainer from 'components/threeSubscriptions/threeSubscriptionsContainer';
import DigitalSubscriptionsContainer from 'components/digitalSubscriptions/digitalSubscriptionsContainer';


// ----- Types ----- //

type PropTypes = {
  sectionId: string,
};


// ----- Component ----- //

export default function SplitSubscriptionsTest(props: PropTypes) {

  return (
    <section id={props.sectionId}>
      <ThreeSubscriptionsContainer
        digitalHeadingSize={3}
        paperHeadingSize={3}
        paperDigitalHeadingSize={3}
      />
      <DigitalSubscriptionsContainer />
    </section>
  );

}
