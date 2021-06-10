// @flow

import React from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { background, border, text } from '@guardian/src-foundations/palette';
import { headline } from '@guardian/src-foundations/typography';
import { SvgTicket } from './ticket';

const container = css`
  width: 100%;
  height: 350px;
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
  border: solid 1px ${border.secondary};
  height: 100%;
  padding: ${space[3]}px;
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

const EventsModule = () => (
  <div css={container}>
    <div css={label}>Guardian Digital Events</div>
    <div css={contentContainer}>
      <div css={icon}><SvgTicket /></div>
    </div>
  </div>
);


export default EventsModule;
