// @flow

import React, { Component } from 'react';
import { find } from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import type { FindResponse } from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import type { Option } from 'helpers/types/option';

type State = {
  findComplete: boolean,
  findResponse: Option<FindResponse>,
}

type PropTypes = {
  searchTerm: string,
}

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
      find(nextProps.searchTerm).then(findResponse => this.setState(
        {
          findComplete: true,
          findResponse,
        }));
    }
    return false;

  }

  render() {
    if (this.state.findResponse) {
      const listItems = this.state.findResponse.Items.map(item => <li>{item.Text}</li>);
      return (
        <div>
          <ul>
            {listItems}
          </ul>
        </div>);
    }
    return null;
  }
}

export { ResultsDropdown };
