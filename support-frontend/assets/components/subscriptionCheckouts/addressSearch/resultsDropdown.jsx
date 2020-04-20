// @flow

import React from 'react';
import type {
  FindResponse,
} from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import type { Option } from 'helpers/types/option';
import * as styles from './resultsDropdownStyles';
import {
  labelId, resultsListId,
  resultsListItemId,
} from 'components/subscriptionCheckouts/addressSearch/addressSearchIdHelpers';

type PropTypes = {
  scope: string,
  findResponse: Option<FindResponse>,
  selectedItem: number,
  setSelectedItem: Function,
  onAddressSelected: Function,
}

const ResultsDropdown = (props: PropTypes) => {
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
          {item.Text} <span css={styles.description}>{item.Description}</span>
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

export { ResultsDropdown };
