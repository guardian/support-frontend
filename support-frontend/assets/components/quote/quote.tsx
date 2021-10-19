// ----- Imports ----- //
import type { Node } from "react";
import React from "react";
import { css } from "@emotion/core";
import { SvgQuote } from "@guardian/src-icons";
import { headline } from "@guardian/src-foundations/typography";
import { space } from "@guardian/src-foundations";
import { border, brandAlt, neutral, sport } from "@guardian/src-foundations/palette";
import { from, until } from "@guardian/src-foundations/mq";
const headshotSize = 68;
const quoteFigure = css`
  background-color: ${neutral[100]};
  position: relative;
  padding: ${space[2]}px;
  margin-bottom: ${space[9]}px;
  border: 1px solid ${border.secondary};

  ${from.desktop} {
    padding-right: ${space[12]}px;
  }
`;
const quoteText = css`
  ${headline.xxxsmall()};
  margin-bottom: ${space[6]}px;

  ${from.mobileLandscape} {
    ${headline.xxsmall()};
  }

  ${from.tablet} {
    ${headline.xsmall()};
  }

  strong {
    font-weight: 700;
  }
`;
const quoteicon = css`
  float: left;
  width: ${space[9]}px;
  max-height: ${space[6]}px;
  margin-top: -${space[1]}px;
  margin-left: -${space[1]}px;

  svg {
    fill: ${brandAlt[400]};
  }

  ${until.mobileLandscape} {
    margin-top: -${space[2]}px;

    svg {
      transform: scale(0.8);
    }
  }
`;
const quoteAttribution = css`
  ${headline.xxxsmall({
  fontStyle: 'italic'
})};
  margin-bottom: ${space[1]}px;
  display: flex;
  align-items: center;
  min-height: 68px;

  ${until.tablet} {
    font-size: 15px;
  }

  span {
    display: block;
  }
`;
const quoteJobTitle = css`
  color: ${sport[300]};
`;
const quoteHeadshot = css`
  display: flex;
  height: ${headshotSize}px;
  width: ${headshotSize}px;
  background-color: ${brandAlt[400]};
  border-radius: 50%;
  flex-shrink: 0;
  flex-basis: auto;
  overflow: hidden;
  margin-right: ${space[2]}px;

  img {
    max-width: 100%;
    max-height: 100%;
  }
`;
const quoteTail = css`
  position: absolute;
  bottom: 1px;
  left: ${space[6]}px;
  width: ${space[9]}px;
  height: ${space[9]}px;
  border: 1px solid ${border.secondary};
  border-top: none;
  border-radius: 0px 0px 51px 0px;
  transform: translateY(100%);
  background-color: inherit;
`;
type PropTypes = {
  children: Node;
  name: string;
  jobTitle: string;
  headshot?: Node;
};

function Quote({
  children,
  name,
  jobTitle,
  headshot
}: PropTypes) {
  return <figure css={quoteFigure}>
      <blockquote css={quoteText}>
        <div css={quoteicon}>
          <SvgQuote />
        </div>
        {children}
      </blockquote>
      <figcaption css={quoteAttribution}>
        {headshot && <div css={quoteHeadshot}>
            {headshot}
          </div>}
        <div>
          <span>{name}</span>
          <span css={quoteJobTitle}>{jobTitle}</span>
        </div>
      </figcaption>
      <div css={quoteTail} />
    </figure>;
}

Quote.defaultProps = {
  headshot: null
};
export default Quote;