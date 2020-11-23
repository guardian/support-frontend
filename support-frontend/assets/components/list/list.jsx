// @flow

import React from 'react';
import { css } from '@emotion/core';
import { brandAlt } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { body } from '@guardian/src-foundations/typography';

type ListPropTypes = {
  items: Array<Object>,
}

const list = css`
  margin: 0 0 20px;

  ${from.desktop} {
    margin: 0 0 30px;
  }
`;

const listItem = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  &:not(:last-of-type) {
    margin-bottom: ${space[4]}px;
  }
`;

const listItemBullet = css`
  display: inline-block;
  width: ${space[3]}px;
  height: ${space[3]}px;
  border-radius: 50%;
  background-color: ${brandAlt[400]};
  margin-top: ${space[1]}px;

  ${from.tablet} {
    width: ${space[4]}px;
    height: ${space[4]}px;
  }
`;

const listItemContent = css`
  ${body.medium()};
  margin-left: ${space[2]}px;
  max-width: 90%;
`;

function List({ items }: ListPropTypes) {
  return (
    <ul css={list}>
      {items.map(item => (
        <li css={listItem}>
          <span css={listItemBullet} />
          <span css={listItemContent}>{item.explainer}</span>
        </li>
    ))}
    </ul>
  );
}

export default List;
