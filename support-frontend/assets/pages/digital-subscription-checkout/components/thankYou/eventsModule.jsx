import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { SvgTicket } from 'components/icons/ticket';

import Text from 'components/text/text';
import { LinkButton } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { getMemLink, emailPreferences } from 'helpers/urls/externalLinks';

const marginForButton = css`
  margin-bottom: ${space[3]}px;
`;

const iconContainer = css`
  margin-bottom: ${space[1]}px;
`;

const EventsModule = () => (
  <div>
    <div css={iconContainer}><SvgTicket /></div>
    <Text title="Guardian digital events">
      <p>
          Enjoy 6 free tickets to Guardian digital events in the first 3 months of your subscription.
          You will be sent your unique redemption code on email shortly, which you can apply at checkout
          to book your free tickets.
      </p>
      <p>
        Browse Guardian Live events and Masterclasses
      </p>
      <LinkButton
        css={marginForButton}
        priority="tertiary"
        size="default"
        icon={<SvgArrowRightStraight />}
        iconSide="right"
        nudgeIcon
        aria-label="Click to find out more about Guardian Live events and Masterclasses"
        href={getMemLink('events')}
        onClick={sendTrackingEventsOnClick({
              id: 'checkout_thankyou_events',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })}
      >
        Guardian events
      </LinkButton>
      <p>
        Sign up to the Guardian Live and Masterclasses newsletter to be the
        first to hear when new events are announced.
      </p>
      <LinkButton
        css={marginForButton}
        priority="tertiary"
        size="default"
        icon={<SvgArrowRightStraight />}
        iconSide="right"
        nudgeIcon
        aria-label="Click to find out more about Guardian Live events and Masterclasses"
        href={emailPreferences}
        onClick={sendTrackingEventsOnClick({
              id: 'checkout_thankyou_email_prefs',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })}
      >
        Manage email subscriptions
      </LinkButton>
    </Text>
  </div>
);

export default EventsModule;
