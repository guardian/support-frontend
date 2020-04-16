// @flow

import React from 'react';
import type {
  FindResponse,
} from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import type { Option } from 'helpers/types/option';
import * as styles from './resultsDropdownStyles';

type PropTypes = {
  findResponse: Option<FindResponse>,
  selectedItem: number,
  setSelectedItem: Function,
  onAddressSelected: Function,
}

const ResultsDropdown = (props: PropTypes) => {
  if (props.findResponse) {
    const listItems = props.findResponse.Items.map((item, index) => (
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      /* keyboard navigation is handled by the search box */
      <li
        role="menuitem"
        css={styles.listItem(index === props.selectedItem)}
        onMouseOver={() => props.setSelectedItem(index)}
        onFocus={() => props.setSelectedItem(index)}
        onClick={() => props.onAddressSelected(index)}
      >
        {item.Text} <span css={styles.description}>{item.Description}</span>
      </li>));
      /* eslint-enable jsx-a11y/click-events-have-key-events */

    return (
      <div css={styles.list}>
        <ul>
          {listItems}
        </ul>
      </div>);
  }
  return null;
};

export { ResultsDropdown };
