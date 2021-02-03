// @flow

import React from 'react';
import { css } from '@emotion/core';
import { brand, brandAlt } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { body, textSans } from '@guardian/src-foundations/typography';

type ListItemText = {
  explainer: string,
  subText?: string
}

type ListBulletSize = 'small' | 'large';

type ListBulletColour = 'light' | 'dark';
type ListPropTypes = {
  items: ListItemText[],
  bulletSize?: ListBulletSize,
  bulletColour?: ListBulletColour,
}

type ListItemProps = {
  item: Object,
  size: ListBulletSize,
  colour: ListBulletColour,
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
  border-radius: 50%;
  /* Sit the bullet in the vertical centre of the first line */
  margin-top: calc((1.5em - ${space[3]}px) / 2);
`;

const listItemBulletLarge = css`
  width: ${space[3]}px;
  height: ${space[3]}px;

  ${from.tablet} {
    margin-top: calc((1.5em - ${space[4]}px) / 2);
    width: ${space[4]}px;
    height: ${space[4]}px;
  }
`;

const listItemBulletSmall = css`
  width: ${space[3]}px;
  height: ${space[3]}px;
`;

const listItemBulletLight = css`
  background-color: ${brandAlt[400]};
`;

const listItemBulletDark = css`
  background-color: ${brand[400]};
`;

const listItemContent = css`
  ${body.medium()};
  margin-left: ${space[2]}px;
  max-width: 90%;
`;

const listItemContentSans = css`
  ${textSans.medium()};
`;

const listItemMainText = css`
  display: block;
  font-weight: 700;
`;

const bulletColours: { [key: ListBulletColour]: string } = {
  light: listItemBulletLight,
  dark: listItemBulletDark,
};

const bulletSizes: { [key: ListBulletSize]: string } = {
  large: listItemBulletLarge,
  small: listItemBulletSmall,
};
function ListItem({ item, colour, size }: ListItemProps) {
  return (
    <li key={item.explainer} css={listItem}>
      <span css={[
        listItemBullet,
        bulletColours[colour],
        bulletSizes[size],
      ]}
      />
      <span css={listItemContent}>{item.explainer}</span>
    </li>
  );
}

ListItem.defaultProps = {
  size: 'large',
  colour: 'light',
};

function ListItemWithSubtext({ item, colour, size }: ListItemProps) {
  return (
    <li key={item.explainer} css={listItem}>
      <span css={[
        listItemBullet,
        bulletColours[colour],
        bulletSizes[size],
      ]}
      />
      <div css={[listItemContent, listItemContentSans]}>
        <span css={listItemMainText}>{item.explainer}</span>
        {item.subText && <span>{item.subText}</span>}
      </div>
    </li>
  );
}

ListItemWithSubtext.defaultProps = {
  size: 'large',
  colour: 'light',
};

function List(props: ListPropTypes) {
  return (
    <ul css={list}>
      {props.items.map(item => (
        <ListItem item={item} colour={props.bulletColour} size={props.bulletSize} />
    ))}
    </ul>
  );
}

List.defaultProps = {
  bulletSize: 'large',
  bulletColour: 'light',
};

function ListWithSubText(props: ListPropTypes) {
  return (
    <ul css={list}>
      {props.items.map(item => (
        <ListItemWithSubtext item={item} colour={props.bulletColour} size={props.bulletSize} />
    ))}
    </ul>
  );
}

ListWithSubText.defaultProps = {
  bulletSize: 'large',
  bulletColour: 'light',
};

export { List, ListWithSubText };
