// @flow

import React, { Component } from 'react';
import { ResultsDropdown } from 'components/subscriptionCheckouts/addressSearch/resultsDropdown';
import { withLabel } from 'hocs/withLabel';
import { Input } from 'components/forms/input';
import { asControlled } from 'hocs/asControlled';
import { find, retrieve } from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import type {
  AddressSearch,
  FindResponse,
} from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import type { Option } from 'helpers/types/option';

type PropTypes = {
  scope: string,
  onSearchComplete: (AddressSearch) => void;
}

type State = {
  findComplete: boolean,
  findTerm: string,
  findResponse: Option<FindResponse>,
  selectedItem: number,
}

const InputWithLabel = asControlled(withLabel(Input));

class AddressSearchBox extends Component<PropTypes, State> {

  constructor() {
    super();
    this.state = {
      findTerm: '',
      findComplete: false,
      findResponse: null,
      selectedItem: -1,
    };
  }

  shouldComponentUpdate(nextProps: Readonly<PropTypes>, nextState: ReadOnly<State>): boolean {
    if (this.state.findComplete === false && nextState.findComplete === true) {
      return true;
    }
    if (nextState.findTerm === '') {
      this.setState({ findResponse: null });
      return true;
    }
    if (nextState.findTerm !== this.state.findTerm) {
      this.setState({ findComplete: false });
      find(nextState.findTerm).then((findResponse: FindResponse) => {
        console.log(findResponse);
        this.setState({
          findComplete: true,
          findResponse,
        });
      });
    }
    return nextState.selectedItem !== this.state.selectedItem;
  }

  onArrowKeys(ev: KeyboardEvent) {
    console.log(ev);
    const currentSelected = this.state.selectedItem;
    if (ev.code === 'ArrowDown' && currentSelected < 9) {
      ev.preventDefault();
      this.setSelectedItem(currentSelected + 1);
    }
    if (ev.code === 'ArrowUp' && currentSelected > -1) {
      ev.preventDefault();
      this.setSelectedItem(currentSelected - 1);
    }
    if (ev.code === 'Enter') {
      console.log(`${currentSelected} selected`);
      this.onAddressSelected(currentSelected);
    }
  }

  onAddressSelected(index: number) {
    const findItem = this.state.findResponse.Items[index];
    if (findItem) {
      retrieve(findItem.Id)
        .then((retrieveResponse) => {
          const address = retrieveResponse.Items[0];
          console.log(address);
          this.props.onSearchComplete(address);
        });
    }
  }

  setSelectedItem(newIndex) {
    console.log(`setting selected item to ${newIndex}`);
    this.setState({ selectedItem: newIndex });
  }

  updateSearchTerm(findTerm: string) {
    this.setState({ findTerm });
  }

  render() {
    return (
      <div>
        <InputWithLabel
          id={`${this.props.scope}-search`}
          label="Search"
          autocomplete="off"
          placeholder="Start typing your address"
          setValue={value => this.updateSearchTerm(value)}
          onKeyDown={ev => this.onArrowKeys(ev)}
        />
        <ResultsDropdown
          findResponse={this.state.findResponse}
          selectedItem={this.state.selectedItem}
          setSelectedItem={index => this.setSelectedItem(index)}
          onAddressSelected={index => this.onAddressSelected(index)}
        />
      </div>);
  }
}

export { AddressSearchBox };
