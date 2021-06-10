// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { textSans, body } from '@guardian/src-foundations/typography';
import { border } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { SvgCalendar } from './icons/calendar';
import { SvgClock } from './icons/clock';

type PropTypes = {
  eventType: string,
  eventImage: Node,
  eventDate: string,
  eventTime: string,
  eventColour: string,
  eventSectionText: string,
  eventDescription: string,
}

const EventCard = (props: PropTypes) => {
  const cardStyle = css`
    width: 45%;
    min-width: 140px;
    max-width: 145px;
  `;

  const cardContent = css`
    border-top: 2px solid ${props.eventColour};
    display: grid;
    grid-template-rows: 85px minmax(120px, 1fr);
  `;

  const cardTypeStyle = css`
    ${textSans.xsmall({ fontWeight: 'bold' })};
    display: block;
    line-height: 135%;
  `;

  const eventImageStyle = css`
    width: 100%;
    img {
      position: relative;
      width: 100%;
      height: auto;
      z-index: 10;
    }
  `;

  const eventTypeStyle = css`
    color: ${props.eventColour};
    ${body.small({ fontWeight: 'bold' })}
    line-height: 115%;
  `;

  const eventDescriptionText = css`
    ${body.small()}
    line-height: 115%;
    margin-top: ${space[3]}px;
  `;

  const textContainer = css`
    border-left: 1px solid ${border.secondary};
    border-right: 1px solid ${border.secondary};
    border-bottom: 1px solid ${border.secondary};
    padding: ${space[1]}px;
  `;

  const infoLine = css`
    display: inline-flex;
    ${textSans.xsmall({ fontWeight: 'bold' })};
    display: block;
    line-height: 135%;

    svg {
      margin-right: ${space[1]}px;
      path {
        fill: ${props.eventColour};
      }
    }
  `;

  return (
    <div css={cardStyle}>
      <h4 css={cardTypeStyle}>{props.eventType}</h4>
      <div css={cardContent}>
        <div css={eventImageStyle}>{props.eventImage}</div>
        <div css={textContainer}>
          <div>
            <div css={infoLine} aria-label="The event date is">
              <SvgCalendar />{props.eventDate}
            </div>
            <div css={infoLine} aria-label="The event will be held at">
              <SvgClock />{props.eventTime}
            </div>
          </div>
          <p css={eventDescriptionText}>
            <span css={eventTypeStyle} aria-label="The event type is">{props.eventSectionText}</span>
            <span aria-label="Event summary:">{props.eventDescription}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
