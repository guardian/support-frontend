// @flow

import React, { Component } from 'react';
import { find } from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import type {
  FindItem,
  FindResponse,
} from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import type { Option } from 'helpers/types/option';
import * as styles from './resultsDropdownStyles';

type State = {
  findComplete: boolean,
  findResponse: Option<FindResponse>,
}

type PropTypes = {
  searchTerm: string,
}

const ListItem = (props: { item: FindItem, index: number }) =>
  <li css={styles.listItem} tabIndex="0">{props.item.Text} <span css={styles.description}>{props.item.Description}</span> </li>;

class ResultsDropdown extends Component<PropTypes, State> {

  constructor() {
    super();
    this.state = {
      findComplete: false,
      findResponse: null,
    };
  }

  shouldComponentUpdate(nextProps: Readonly<PropTypes>, nextState: ReadOnly<State>): boolean {
    if (this.state.findComplete === false && nextState.findComplete === true) {
      return true;
    }
    if (nextProps.searchTerm !== this.props.searchTerm) {
      this.setState({ findComplete: false });
      find(nextProps.searchTerm).then((findResponse: FindResponse) => {
        console.log(findResponse);
        this.setState({
          findComplete: true,
          findResponse,
        });
      });
    }
    return false;
  }

  render() {
    if (this.state.findResponse) {
      const listItems = this.state.findResponse.Items.map((item, i) => <ListItem item={item} index={i} />);
      return (
        <div css={styles.list}>
          <ul>
            {listItems}
          </ul>
        </div>);
    }
    return null;
  }
}

export { ResultsDropdown };
