import * as React from "react";
import { css } from "@emotion/core";
import { space } from "@guardian/src-foundations";
import { brand } from "@guardian/src-foundations/palette";
const listItem = css`
  display: flex;
  align-items: flex-start;

  & > * + * {
    margin-left: ${space[2]}px;
  }
`;
const list = css`
  & > * + * {
    margin-top: ${space[4]}px;
  }
`;
type BulletPointedListItemProps = {
  item: string;
};
type BulletPointedListProps = {
  items: string[];
};

const SvgBullet = () => <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="4" cy="4" r="4" fill={`${brand[500]}`} />
  </svg>;

const BulletPointedListItem = ({
  item
}: BulletPointedListItemProps) => <li css={listItem}>
    <div>
      <SvgBullet />
    </div>
    <div>{item}</div>
  </li>;

const BulletPointedList = ({
  items
}: BulletPointedListProps) => <ul css={list}>
    {items.map(item => <BulletPointedListItem key={item} item={item} />)}
  </ul>;

export default BulletPointedList;