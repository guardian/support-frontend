import type { Node } from "react";
import React from "react";
import { css } from "@emotion/core";
import { textSans, body } from "@guardian/src-foundations/typography";
import { from } from "@guardian/src-foundations/mq";
import { border } from "@guardian/src-foundations/palette";
import { space } from "@guardian/src-foundations";
import { SvgCalendar } from "components/icons/calendar";
type PropTypes = {
  eventType: string;
  eventImage: Node;
  eventDate: string;
  eventColour: string;
  eventSectionText: string;
  eventDescription: string;
};
const cardContent = css`
  display: grid;
  grid-template-rows: 85px 170px;

  ${from.mobileMedium} {
    grid-template-rows: 1fr 1.5fr;
  }

  ${from.tablet} {
    grid-template-rows: 1fr 1.6fr;
  }

  ${from.leftCol} {
    grid-template-rows: 1fr 1.3fr;
  }
`;
const cardTypeStyle = css`
  ${textSans.xsmall({
  fontWeight: 'bold'
})};
  display: block;
  line-height: 135%;
  padding-bottom: ${space[2]}px;
`;
const eventImageStyle = css`
  max-width: 100%;
  width: 100%;
  img {
    position: relative;
    width: 100%;
    z-index: 10;
  }
`;
const eventTypeStyle = css`
  ${body.small({
  fontWeight: 'bold'
})}
  line-height: 115%;
`;
const eventDescriptionText = css`
  ${body.small()}
  line-height: 115%;
  margin-top: ${space[3]}px;
  border-top: 1px solid ${border.secondary};
`;
const textContainer = css`
  width: 100%;
  max-width: 100%;
  border-left: 1px solid ${border.secondary};
  border-right: 1px solid ${border.secondary};
  border-bottom: 1px solid ${border.secondary};
  padding: ${space[2]}px ${space[1]}px ${space[3]}px;
  margin-top: -6px;
`;
const infoLine = css`
  display: inline-flex;
  ${textSans.xsmall({
  fontWeight: 'bold'
})};
  display: block;
  line-height: 135%;

  svg {
    margin-right: ${space[1]}px;
  }
`;

const EventCard = (props: PropTypes) => {
  const borderColour = css`
    border-top: 2px solid ${props.eventColour};
  `;
  const textColour = css`
  color: ${props.eventColour};
`;
  const svgFillColour = css`
    svg path {
      fill: ${props.eventColour};
    }
  `;
  return <section>
      <h4 css={cardTypeStyle}>{props.eventType}</h4>
      <div css={[cardContent, borderColour]}>
        <div css={eventImageStyle}>{props.eventImage}</div>
        <div css={textContainer}>
          <div>
            <div css={[infoLine, svgFillColour]} aria-label="The event date is">
              <SvgCalendar />{props.eventDate}
            </div>
          </div>
          <p css={eventDescriptionText}>
            <span css={[eventTypeStyle, textColour]} aria-label="The event type is">
              {props.eventSectionText}<span aria-hidden="true">&nbsp;/{' '}</span>
            </span>
            <span aria-label="Event summary:">{props.eventDescription}</span>
          </p>
        </div>
      </div>
    </section>;
};

export default EventCard;