// @flow

import React from 'react';

import Content, { NarrowContent } from 'components/content/content';
import Text from 'components/text/text';
import GridImage from 'components/gridImage/gridImage';
import AnchorButton from 'components/button/anchorButton';
import ArrowRightStraight from 'components/svgs/arrowRightStraight';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';

export default function CtaSubscribe() {
  return (
    <Content
      appearance="feature"
      modifierClasses={['subscribe']}
      image={<GridImage gridId="showcaseSubscribe" srcSizes={[1000, 500]} sizes="(max-width: 740px) 90vw, 600px" imgType="png" />}
    >
      <Text title="Subscribe">
        <p>
          From the Digital Pack, to the new Guardian Weekly magazine,
          you can subscribe to the Guardian from wherever you are.
        </p>
      </Text>
      <NarrowContent>
        <AnchorButton
          aria-label={null}
          icon={<ArrowRightStraight />}
          href="/subscribe"
          onClick={() => sendClickedEvent('support_header_page_cta_subscribe')()}
        >
          Choose a Subscription
        </AnchorButton>
      </NarrowContent>
    </Content>
  );
}
