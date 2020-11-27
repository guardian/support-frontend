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

const giftPageVersion = (
  <span>
    <h4 css={title}>Looking for a subscription for yourself?</h4>
    <div css={button}>
      <ThemeProvider theme={buttonReaderRevenue}>
        <LinkButton
          href={routes.digitalSubscriptionLanding}
          priority="tertiary"
        >
            See personal subscriptions
        </LinkButton>
      </ThemeProvider>
    </div>
  </span>
);

const nonGiftPageVersion = (
  <span>
    <h4 css={title}>Gift subscriptions</h4>
    <span css={paragraph}>A digital subscription makes a great gift.</span>
    <div css={button}>
      <ThemeProvider theme={buttonReaderRevenue}>
        <LinkButton
          href={routes.digitalSubscriptionLandingGift}
          priority="tertiary"
        >
            See gift subscriptions
        </LinkButton>
      </ThemeProvider>
    </div>
  </span>
);

const GiftNonGiftLink = (props: {orderIsAGift: boolean}) => (
  <div className="hope-is-power__terms">
    <div className="hope-is-power--centered">
      {props.orderIsAGift ?
        giftPageVersion :
        nonGiftPageVersion
      }

    </div>
  </div>);


export default GiftNonGiftLink;
