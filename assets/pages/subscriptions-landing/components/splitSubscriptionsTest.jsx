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


// ----- Functions ----- //

function getSections() {

  if (getQueryParameter('splitSubscriptions') === 'true') {
    return [
      <DigitalSubscriptionsContainer headingSize={3} />,
      <PaperSubscriptionsContainer headingSize={3} />,
    ];
  }

  return (
    <ThreeSubscriptionsContainer
      digitalHeadingSize={3}
      paperHeadingSize={3}
      paperDigitalHeadingSize={3}
    />
  );

}


// ----- Component ----- //

export default function SplitSubscriptionsTest(props: PropTypes) {

  return (
    <section id={props.sectionId}>
      {getSections()}
    </section>
  );

}
