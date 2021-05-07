// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { headline } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { border, brandAlt, neutral, sport } from '@guardian/src-foundations/palette';

const quoteFigure = css`
  position: relative;
  padding: ${space[2]}px;
  border: 1px solid ${border.secondary};
`;

const quoteText = css`
  ${headline.xsmall()};
  margin-bottom: ${space[12]}px;

  strong {
    font-weight: 700;
  }
`;

const quoteAttribution = css`
  ${headline.xxxsmall({ fontStyle: 'italic' })};
  margin-top: -${space[1]}px;
  margin-bottom: ${space[6]}px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  span {
    display: block;
  }
`;

const quoteJobTitle = css`
  color: ${sport[300]};
`;

const quoteHeadshot = css`
  display: flex;
  height: 68px;
  width: 68px;
  background-color: ${brandAlt[400]};
  border-radius: 50%;
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
  background-color: ${neutral[100]};
`;

type PropTypes = {|
  children: Node;
  name: string;
  jobTitle: string;
  // headshot: Node;
|}

function Quote({ children, name, jobTitle }: PropTypes) {
  return (
    <figure css={quoteFigure}>
      <blockquote css={quoteText}>
        {children}
      </blockquote>
      <figcaption css={quoteAttribution}>
        <div>
          <span>{name}</span>
          <span css={quoteJobTitle}>{jobTitle}</span>
        </div>
        <div css={quoteHeadshot} />
      </figcaption>
      <div css={quoteTail} />
    </figure>
  );
}

export default Quote;
