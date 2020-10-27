// @flow
import React from 'react';
import { css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import { headline, body } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { LinkButton, buttonReaderRevenue } from '@guardian/src-button';
import { routes } from 'helpers/routes';
// styles
import './digitalSubscriptionLanding.scss';

const title = css`
  ${headline.xsmall({ fontWeight: 'bold' })};
  ${from.tablet} {
    ${headline.small({ fontWeight: 'bold' })};
  }
  ${from.desktop} {
    ${headline.medium({ fontWeight: 'bold' })};
  }
`;

const paragraph = css`
  ${body.medium()};
  display: block;
  margin: ${space[1]}px 0 ${space[5]}px;
`;

const button = css`
  margin-top: ${space[5]}px;
`;

const GiftNonGiftLink = (props: {orderIsAGift: boolean}) => (
  <div className="hope-is-power__terms">
    <div className="hope-is-power--centered">
      {props.orderIsAGift ?
        <h4 css={title}>Looking for a subscription for yourself?</h4> :
        <h4 css={title}>Gift subscriptions</h4>}
      {!props.orderIsAGift && <span css={paragraph}>A subscription makes a great gift.</span>}
      <div css={button}>
        <ThemeProvider theme={buttonReaderRevenue}>
          <LinkButton
            href={props.orderIsAGift ? routes.digitalSubscriptionLanding : routes.digitalSubscriptionLandingGift}
            priority="tertiary"
          >
            {props.orderIsAGift ? 'See personal subscriptions' : 'See gift subscriptions'}
          </LinkButton>
        </ThemeProvider>
      </div>
    </div>
  </div>);


export default GiftNonGiftLink;
