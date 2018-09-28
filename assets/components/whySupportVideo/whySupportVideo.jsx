// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import Heading, { type HeadingSize } from 'components/heading/heading';
import Video from 'components/video/video';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type VideoId } from 'helpers/youtube';


// ----- Props ----- //

type PropTypes = {
  headingSize: HeadingSize,
  countryGroupId: CountryGroupId,
};


// ----- Functions ----- //

function getVideoId(cgId: CountryGroupId): VideoId {

  switch (cgId) {

    case 'UnitedStates':
    case 'AUDCountries':
      return 'subscribeCampaignUS';

    default:
      return 'subscribeCampaignUK';

  }

}


// ----- Component ----- //

function WhySupportVideo(props: PropTypes) {

  const { headingSize, countryGroupId, ...otherProps } = props;

  const videoId = getVideoId(countryGroupId);

  return (
    <div className="component-why-support-video" {...otherProps}>
      <PageSection heading="Why support?" modifierClass="why-support-video">
        <Video videoId={videoId} title="The Guardian - a space worth supporting" />
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
