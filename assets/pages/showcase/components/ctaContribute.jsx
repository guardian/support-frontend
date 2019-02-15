// @flow

import React from 'react';

import Content, { NarrowContent } from 'components/content/content';
import Text from 'components/text/text';
import AnchorButton from 'components/button/anchorButton';
import ArrowRightStraight from 'components/svgs/arrowRightStraight';

import WithSupport from 'components/svgs/withSupport';
import OneMillionCircles from 'components/svgs/oneMillionCircles';

export default function CtaContribute() {
  return (
    <Content type="feature-secondary" modifierClasses={['contribute']}>
      <div className="wrapper">
        <div className="image">
          <WithSupport />
        </div>
        <div>
          <Text title="Contribute">
            <p>
            At a time when factual, honest reporting is more vital than ever, we need your help to continue our work.
            If everyone who reads our reporting, who likes it, helps to support it, our future would be much
            more secure. <strong>Make a single or recurrent payment, and help us to change the story.</strong>
            </p>
          </Text>
          <NarrowContent>
            <AnchorButton
              icon={<ArrowRightStraight />}
              aria-label={null}
              appearance="secondary"
              href="/contribute"
            >
            Make a Contribution
            </AnchorButton>
          </NarrowContent>
        </div>
      </div>
      <OneMillionCircles />
    </Content>
  );
}
