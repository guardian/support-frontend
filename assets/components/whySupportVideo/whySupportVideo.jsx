// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import Heading, { type HeadingSize } from 'components/heading/heading';


// ----- Props ----- //

type PropTypes = {
  headingSize: HeadingSize,
};


// ----- Component ----- //

function WhySupportVideo(props: PropTypes) {

  const { headingSize, ...otherProps } = props;

  return (
    <div className="component-why-support-video" {...otherProps}>
      <PageSection heading="Why support?" modifierClass="why-support-video">
        <div className="component-why-support-video__video" />
        <Heading className="component-why-support-video__heading" size={props.headingSize}>
          Your subscription helps support independent investigative journalism
        </Heading>
        <p className="component-why-support-video__copy">
          Independence means we can pursue a story without fear of where it might take us.
          It means we&#39;re free to ask the questions no one else is asking, to hold power to
          account and to bring about real, positive change. With the help of subscribers
          like you, our journalism can change the story. Subscribe to change.
        </p>
      </PageSection>
    </div>
  );

}


// ----- Exports ----- //

export default WhySupportVideo;
