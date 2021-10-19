import React from "react";
import { storiesOf } from "@storybook/react";
import FlexContainer from "components/containers/flexContainer";
import GridImage from "components/gridImage/gridImage";
import GridPicture from "components/gridPicture/gridPicture";
const stories = storiesOf('Images', module);
stories.add('Grid Image', () => <FlexContainer>
    <p style={{
    padding: '12px',
    textAlign: 'center',
    minWidth: '50%'
  }}>
      The GridImage component is responsive and will request different sizes of the
      image at the specified breakpoints
    </p>
    <GridImage gridId="weeklyCampaignHeroImg" srcSizes={[1000, 500, 140]} sizes="(max-width: 740px) 100%,
  (max-width: 1067px) 150%,
  500px" imgType="png" altText="A collection of Guardian Weekly magazines" />
  </FlexContainer>);
stories.add('Grid Picture', () => <div style={{
  maxHeight: '500px'
}}>
    <FlexContainer>
      <p style={{
      padding: '12px',
      textAlign: 'center',
      minWidth: '50%'
    }}>
      The GridPicture component can show completely different images at different breakpoints
      </p>
      <GridPicture sources={[{
      gridId: 'editionsPackshot',
      srcSizes: [500, 140],
      imgType: 'png',
      sizes: '(min-width: 740px) 500px, 100vw',
      media: '(max-width: 1139px)'
    }, {
      gridId: 'editionsPackshotAus',
      srcSizes: [500],
      imgType: 'png',
      sizes: '(min-width: 1140px) 500px',
      media: '(min-width: 1140px)'
    }]} fallback="editionsPackshot" fallbackSize={500} altText="" fallbackImgType="png" />
    </FlexContainer>
  </div>);