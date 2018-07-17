// @flow

// ----- Imports ----- //

import React from 'react';

import { getQueryParameter } from 'helpers/url';

import ThreeSubscriptionsContainer from 'components/threeSubscriptions/threeSubscriptionsContainer';
import DigitalSubscriptionsContainer from 'components/digitalSubscriptions/digitalSubscriptionsContainer';
import PaperSubscriptionsContainer from 'components/paperSubscriptions/paperSubscriptionsContainer';


// ----- Types ----- //

type PropTypes = {
  sectionId: string,
};


// ----- Component ----- //

export default function SplitSubscriptionsTest(props: PropTypes) {

  const variant = getQueryParameter('splitSubscriptions') === 'true';

  const sections = variant ?
    [<DigitalSubscriptionsContainer />, <PaperSubscriptionsContainer />] :
    <ThreeSubscriptionsContainer
      digitalHeadingSize={3}
      paperHeadingSize={3}
      paperDigitalHeadingSize={3}
    />;

  return (
    <section id={props.sectionId}>
      {sections}
    </section>
  );

}
