// @flow

import React from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { background, border, text } from '@guardian/src-foundations/palette';
import { headline, titlepiece, body } from '@guardian/src-foundations/typography';
import { SvgTicket } from './icons/ticket';
import EventCard from './eventCard';
import { ennyImage } from './eventsImages';
import sport from './sport.png';

const container = css`
  box-sizing: border-box;
  width: 100%;
  max-height: 360px;
  padding: 0;
  background-color: ${background.primary};
  border: pink 1px dashed;

  ${from.desktop} {
    padding: ${space[12]}px;
  }
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

  ${from.tablet} {
    ${headline.xsmall({ fontWeight: 'bold' })};
    top: -34px;
  }
`;

const contentContainer = css`
  display: flex;
  flex-direction: column;
  border: solid 1px ${border.secondary};
  height: 100%;
  padding: ${space[3]}px;
  padding-bottom: ${space[4]}px;

  ${from.tablet} {
    display: inline-flex;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const textContentContainer = css`
  width: 100%;

  ${from.tablet} {
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
  ${titlepiece.small()};
  font-size: 28px;
  line-height: 115%;
  margin-top: ${space[2]}px;
`;

const para = css`
  ${body.medium()};
  margin-top: ${space[1]}px;
`;

const paraSecond = css`
  ${body.medium()};
  line-height: 115%;
  margin-top: ${space[4]}px;
`;

const eventCardContainer = css`
  width: 100%;
  display: inline-flex;
  justify-content: space-evenly;

  ${from.tablet} {
    max-width: 45%;
  }

`;

const EventsModule = () => (
  <div css={container}>
    <h2 css={label}>Guardian Digital Events</h2>
    <div css={contentContainer}>
      <div css={textContentContainer}>
        <div css={icon}><SvgTicket /></div>
        <h3 css={cardTitle} aria-label="Offer for new Guardian subscribers: ">Enjoy 6 free tickets to digital Guardian events</h3>
        <p css={para}>In the <strong>first 3 months</strong> of your subscription</p>
        <p css={paraSecond}>
          I&apos;m baby man bun et gentrify qui brunch tumeric veniam fam blue bottle
          jean shorts cillum neutra direct trade scenester thundercats.
        </p>
      </div>
      <div css={eventCardContainer}>
        <EventCard
          eventType="Featured event"
          eventImage={ennyImage}
          eventDate="27 July 2021"
          eventTime="8-9pm BST"
          eventColour="#6B5840"
          eventSectionText="Culture / "
          eventDescription="In conversation with UK rapper Enny"
        />
        <EventCard
          eventType="Featured masterclass"
          eventImage={<img src={sport} alt="" />}
          eventDate="22 July 2021"
          eventTime="6-8pm BST"
          eventColour="#007ABC"
          eventSectionText="Sport / "
          eventDescription="Transform your passion for sportswriting into a successful career"
        />
      </div>
    </div>
  </div>
);


export default EventsModule;
