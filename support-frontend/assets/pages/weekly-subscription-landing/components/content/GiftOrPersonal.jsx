// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { body, headline } from '@guardian/src-foundations/typography';
import { LinkButton } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';

import { routes } from 'helpers/routes';

type PropTypes = {|
  orderIsAGift: boolean,
|};

const giftOrPersonal = css`
  padding: ${space[3]}px ${space[3]}px ${space[12]}px;
`;

const giftOrPersonalCopy = css`
  ${body.medium()};
  margin-bottom: ${space[9]}px;
`;

const giftOrPersonalHeading = css`
  ${headline.medium({ fontWeight: 'bold' })};
`;

function GiftOrPersonal({ orderIsAGift }: PropTypes) {
  return (
    <section css={giftOrPersonal}>
      <div css={giftOrPersonalCopy}>
        <h2 css={giftOrPersonalHeading}>{orderIsAGift ? 'Looking for a subscription for yourself?' : 'Gift subscriptions'}</h2>
        {!orderIsAGift && <p>A Guardian Weekly subscription makes a great gift.</p>}
      </div>
      <LinkButton
        icon={<SvgArrowRightStraight />}
        iconSide="right"
        priority="tertiary"
        href={orderIsAGift ?
              routes.guardianWeeklySubscriptionLanding : routes.guardianWeeklySubscriptionLandingGift}
      >
        {orderIsAGift ? 'See personal subscriptions' : 'See gift subscriptions'}
      </LinkButton>
    </section>
  );
}

export default GiftOrPersonal;
