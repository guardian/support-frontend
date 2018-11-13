import React from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';
import CtaLink from 'components/ctaLink/ctaLink';

import './contributeCta.scss';

const BLOCK_NAME = 'component-contribute-cta';

export default function ContributeCta() {
  return (
    <section className={BLOCK_NAME}>
      <Heading size={3} className={`${BLOCK_NAME}__heading`}>
        Contribute
      </Heading>
      <p>
        At a time when factual, honest reporting is more vital than ever, we need your help to continue our work.
        If everyone who reads our reporting, who likes it, helps to support it, our future would be much more secure.
        <strong> Make a single or recurrent payment, and help us to change the story.</strong>
      </p>
      <CtaLink
        text="Make a contribution"
        url="/contribute"
        accessibilityHint="Make a contribution"
      />
    </section>
  );
}
