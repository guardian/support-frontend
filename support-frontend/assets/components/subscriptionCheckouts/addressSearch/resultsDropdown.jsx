// @flow

import React from 'react';
import type {
  FindItem,
  FindResponse,
} from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import type { Option } from 'helpers/types/option';
import * as styles from './resultsDropdownStyles';

type PropTypes = {
  findResponse: Option<FindResponse>,
  selectedItem: number,
  setSelectedItem: Function,
}

const ListItem = (props: { item: FindItem, index: number, selected: boolean, setSelectedItem: Function }) => (

  <li
    css={styles.listItem(props.selected)}
    tabIndex="-1"
    onMouseOver={() => props.setSelectedItem(props.index)}
  >
    {props.item.Text}
    <span css={styles.description}>{props.item.Description}</span>
  </li>);

const ResultsDropdown = (props: PropTypes) => {
  if (props.findResponse) {
    const listItems = props.findResponse.Items.map((item, index) =>
      <ListItem
        item={item}
        index={index}
        selected={index === props.selectedItem}
        setSelectedItem={props.setSelectedItem}
      />);

    return (
      <div css={styles.list}>
        <ul tabIndex="0">
          {listItems}
        </ul>
      </div>);
  }
  return null;
};

export { ResultsDropdown };
