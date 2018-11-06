import React from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';
import CtaLink from 'components/ctaLink/ctaLink';
import GridPicture from 'components/gridPicture/gridPicture';

const BLOCK_NAME = 'component-subscribe-cta';

export default function SubscribeCta() {
  return (
    <section className={BLOCK_NAME}>
      <Heading size={3} className={`${BLOCK_NAME}__heading`}>
        Subscribe
      </Heading>
      <GridPicture
        sources={[
          {
            gridId: 'paperHeroMobile',
            srcSizes: [140, 500, 1000],
            imgType: 'png',
            sizes: '90vw',
            media: '(max-width: 739px)',
          },
          {
            gridId: 'paperHeroDesktop',
            srcSizes: [140, 500, 1000],
            imgType: 'png',
            sizes: '(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
            media: '(min-width: 740px)',
          },
        ]}
        fallback="paperHeroDesktop"
        fallbackSize={500}
        altText=""
        fallbackImgType="png"
      />
      <p>
        From the Digital Pack, to the new Guardian Weekly magazine to the daily newspaper,
        you can subscribe to the Guardian <strong>for as little as 99p a day</strong>
      </p>
      <CtaLink
        text="Choose a subscription"
        url="#"
        accessibilityHint="Choose a subscription"
      />
    </section>
  );
}
