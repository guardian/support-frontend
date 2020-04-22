// @flow

import React from 'react';
import type {
  FindItem,
  FindResponse,
} from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import type { Option } from 'helpers/types/option';
import * as styles from 'components/subscriptionCheckouts/addressSearch/addressResultsDropdownStyles';
import {
  labelId, resultsListId,
  resultsListItemId,
} from 'components/subscriptionCheckouts/addressSearch/addressSearchIdHelpers';
import {
  parseHighlights,
  parseTextRegions,
} from 'components/subscriptionCheckouts/addressSearch/addressResultsHelpers';

type PropTypes = {
  scope: string,
  findResponse: Option<FindResponse>,
  selectedItem: number,
  setSelectedItem: Function,
  onAddressSelected: Function,
}

const HighlightedDescription = ({ item }: { item: FindItem }) => {
  console.log(item);
  const highlights = item.Highlight.split(';');
  const text = parseTextRegions(item.Text, highlights[0])
    .map(textRegion =>
      <span className={textRegion.type}>{item.Text.substring(textRegion.start, textRegion.end + 1)}</span>);

  const description = parseTextRegions(item.Description, highlights[1] || '')
    .map(textRegion =>
      <span className={textRegion.type}>{item.Description.substring(textRegion.start, textRegion.end + 1)}</span>);

  return text.concat([<span>{' '}</span>]).concat(description);
};

const AddressResultsDropdown = (props: PropTypes) => {
  if (props.findResponse) {
    const { scope } = props;
    const listItems = props.findResponse.Items.map((item, index) => {
      const selected = index === props.selectedItem;
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      /* keyboard navigation is handled by the search box */
      return (
        <li
          css={styles.listItem(selected)}
          role="option"
          id={resultsListItemId(scope, index)}
          onMouseOver={() => props.setSelectedItem(index)}
          onFocus={() => props.setSelectedItem(index)}
          onClick={() => props.onAddressSelected(index)}
          aria-selected={selected}
        >
          <HighlightedDescription item={item} />
        </li>);
      /* eslint-enable jsx-a11y/click-events-have-key-events */
    });

    return (
      <ul
        id={resultsListId(scope)}
        css={styles.list}
        role="listbox"
        aria-labelledby={labelId(scope)}
      >
        {listItems}
      </ul>
    );
  }
  return null;
};

export { AddressResultsDropdown, parseHighlights };
