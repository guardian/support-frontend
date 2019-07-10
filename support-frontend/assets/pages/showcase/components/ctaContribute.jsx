// @flow

import React from 'react';

import Content, { NarrowContent } from 'components/content/content';
import Text from 'components/text/text';
import AnchorButton from 'components/button/anchorButton';
import ArrowRightStraight from 'components/svgs/arrowRightStraight';

import WithSupport from 'components/svgs/withSupport';
import OneMillionCircles from 'components/svgs/oneMillionCircles';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';

export default function CtaContribute() {
  return (
    <Content appearance="highlight" modifierClasses={['contribute']}>
      <div className="wrapper">
        <div className="image">
          <WithSupport />
        </div>
        <div>
          <Text title="Contribute">
            <p>
              We chose a model that means our reporting is open to everyone,
              funded by our readers. This support safeguards our essential editorial
              independence, emboldening us to challenge the powerful and
              shed light where others won’t.
            </p>
            <p>
              The Guardian{'\''}s open, independent journalism has now been supported by
              over a million people around the world – but we must keep building
              on this for the years to come. Every contribution, whether big or
              small, means we can keep investigating and exploring the critical
              issues of our time.&nbsp;
              <strong>
                Make a contribution from as little as
                £1, and it only takes a minute.
              </strong>
            </p>
          </Text>
          <NarrowContent>
            <AnchorButton
              icon={<ArrowRightStraight />}
              aria-label={null}
              appearance="secondary"
              href="/contribute"
              onClick={() => sendClickedEvent('support_page_cta_contribute')()}
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
