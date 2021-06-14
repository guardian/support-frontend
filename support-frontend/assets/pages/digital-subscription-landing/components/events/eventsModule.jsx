// @flow

import React from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { background, text, border } from '@guardian/src-foundations/palette';
import { headline, body } from '@guardian/src-foundations/typography';
import { SvgTicket } from './icons/ticket';
import EventCard from './eventCard';
import { ennyImage, emmaJohnImage } from './eventsImages';
import { eventsOfferPink, eventsOfferRed } from 'stylesheets/emotion/colours';

const container = css`
  box-sizing: border-box;
  width: 100%;
  background-color: ${background.primary};
`;

const label = css`
  display: inline;
  background-color: ${background.inverse};
  color: ${text.ctaPrimary};
  padding: ${space[1]}px ${space[2]}px;
  ${headline.xxxsmall({ fontWeight: 'bold' })};
  top: -27px;
  position: absolute;
  left: 0;

  ${from.tablet} {
    ${headline.xxsmall({ fontWeight: 'bold' })};
    top: -30px;
  }

  ${from.desktop} {
    ${headline.xsmall({ fontWeight: 'bold' })};
    top: -34px;
  }
`;

const contentContainer = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${space[3]}px;
  padding-bottom: ${space[4]}px;

  ${from.tablet} {
    display: inline-flex;
    flex-direction: row;
    justify-content: space-between;
    border: solid 1px ${border.secondary};

  }
`;

const textContentContainer = css`
  width: 100%;

  ${from.tablet} {
    width: 50%;
  }

  ${from.desktop} {
    width: 53%;
  }

  ${from.leftCol} {
    width: 55%;
  }
`;

const icon = css`
  display: flex;
  height: 34px;
  width: 34px;
  border-radius: 50%;
  background-color: ${background.ctaPrimary};
  align-items: center;
  justify-content: center;
`;

const cardTitle = css`
  ${headline.xxsmall({ fontWeight: 'bold' })};
  line-height: 115%;
  margin-top: ${space[2]}px;

  ${from.tablet} {
    ${headline.xsmall({ fontWeight: 'bold' })};
    /* Overriding font-size to match the product card titles on same page */
    font-size: 26px;
  }

  ${from.desktop} {
    ${headline.medium({ fontWeight: 'bold' })};
    /* Overriding font-size to match the product card titles on same page */
    font-size: 36px;
  }
`;

const para = css`
  ${body.medium()};
  line-height: 135%;
  margin-top: ${space[1]}px;
`;

const paraSecond = css`
  ${body.medium()};
  line-height: 135%;
  margin: ${space[4]}px 0 ${space[5]}px;

  ${from.tablet} {
    margin-bottom: ${space[4]}px 0;
  }
`;

const eventCardContainer = css`
  width: 100%;
  display: inline-flex;
  justify-content: space-between;

  ${from.mobileMedium} {
    justify-content: flex-start;
    section + section {
      margin-left: ${space[5]}px;
    }
  }

  ${from.tablet} {
    max-width: 47%;
    justify-content: flex-end;
    padding-right: ${space[3]}px;
    padding-top: ${space[6]}px;
  }

  ${from.desktop} {
    max-width: 45%;
    padding-right: 0;
  }

  ${from.leftCol} {
    max-width: 45%;
    padding-right: ${space[5]}px;
  }

`;

const EventsModule = () => (
  <div css={container}>
    <h2 css={label}>Special offer</h2>
    <div css={contentContainer}>
      <div css={textContentContainer}>
        <div css={icon}><SvgTicket /></div>
        <h3 css={cardTitle} aria-label="Offer for new Guardian subscribers: ">Enjoy 6 free tickets to digital Guardian events</h3>
        <p css={para}>In the <strong>first 3 months</strong> of your subscription</p>
        <p css={paraSecond}>
        Join interactive Live conversations with journalists, political leaders and cultural
        icons. Or get inspired to learn a new skill in selected Masterclasses. With events
        launching weekly and available on-demand.
        </p>
      </div>
      <div css={eventCardContainer}>
        <EventCard
          eventType="Featured event"
          eventImage={ennyImage}
          eventDate="27 July 2021"
          eventTime="8-9pm BST"
          eventColour={eventsOfferPink}
          eventSectionText="Culture / "
          eventDescription="In conversation with UK rapper Enny"
        />
        <EventCard
          eventType="Featured masterclass"
          eventImage={emmaJohnImage}
          eventDate="22 July 2021"
          eventTime="6-8pm BST"
          eventColour={eventsOfferRed}
          eventSectionText="Sport / "
          eventDescription="How to use sports psychology to improve your life"
        />
      </div>
    </div>
  </div>
);


export default EventsModule;
