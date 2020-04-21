// @flow

import React, { Component } from 'react';
import { ResultsDropdown } from 'components/subscriptionCheckouts/addressSearch/resultsDropdown';
import { Input } from 'components/forms/input';
import { asControlled } from 'hocs/asControlled';
import {
  find,
  moreResults,
  retrieve,
} from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import type {
  AddressSearch,
  FindResponse,
} from 'components/subscriptionCheckouts/addressSearch/loqateApi';
import type { Option } from 'helpers/types/option';
import { withError } from 'hocs/withError';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { FormField } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { firstError } from 'helpers/subscriptionsForms/validation';
import { Label } from 'components/forms/label';
import {
  inputId,
  labelId, resultsListId, resultsListItemId,
} from 'components/subscriptionCheckouts/addressSearch/addressSearchIdHelpers';

type PropTypes = {
  scope: string,
  onSearchComplete: (AddressSearch) => void;
  formErrors: FormError<FormField>[],
}

type State = {
  findComplete: boolean,
  findTerm: string,
  findResponse: Option<FindResponse>,
  selectedItem: number,
}

const InputWithError = withError(asControlled(Input));

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

  shouldComponentUpdate(nextProps: PropTypes, nextState: State): boolean {
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

  componentDidUpdate() {
    if (this.state.selectedItem === -1) {
      return;
    }
    const resultItem = document.getElementById(`component-address-search-result-item-${this.state.selectedItem}`);
    if (resultItem) {
      resultItem.scrollIntoView({ block: 'nearest' });
    }
  }

  onArrowKeys(ev: KeyboardEvent) {
    if (!this.state.findResponse) {
      return;
    }
    const currentSelected = this.state.selectedItem;
    if (ev.code === 'ArrowDown' && currentSelected < this.state.findResponse.Items.length - 1) {
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
    if (!this.state.findResponse || !this.state.findResponse.Items[index]) {
      return;
    }
    const findItem = this.state.findResponse.Items[index];
    if (findItem.Type === 'Address') {
      retrieve(findItem.Id)
        .then((retrieveResponse) => {
          const address = retrieveResponse.Items[0];
          console.log(address);
          this.props.onSearchComplete(address);
        });
    } else {
      this.setState({ findComplete: false });
      moreResults(findItem.Id).then((findResponse: FindResponse) => {
        console.log(findResponse);
        this.setState({
          findComplete: true,
          findResponse,
        });
      });
    }
  }

  setSelectedItem(newIndex: number) {
    console.log(`setting selected item to ${newIndex}`);
    this.setState({ selectedItem: newIndex });
  }

  getError = () =>
    (this.state.findTerm === '' ? firstError('lineOne', this.props.formErrors) : null);

  updateSearchTerm(findTerm: string) {
    this.setState({ findTerm });
  }

  render() {
    const { scope } = this.props;
    const { selectedItem } = this.state;
    return (
      <div>
        <Label labelId={labelId(scope)} htmlFor={inputId(scope)} label="Search">
          <div>
            { /* eslint-disable jsx-a11y/role-has-required-aria-props */ }
            {/* This inspection seems to be configured to use v1.0 of the aria spec. We are using 1.1
            detailed here: https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html */}
            <div
              role="combobox"
              aria-haspopup="listbox"
              aria-owns={resultsListId(scope)}
              aria-expanded={!!this.state.findResponse}
            >
              {/* eslint-enable jsx-a11y/role-has-required-aria-props */}
              <InputWithError
                id={inputId(scope)}
                label="Search"
                autocomplete="off"
                placeholder="Start typing your address"
                setValue={value => this.updateSearchTerm(value)}
                onKeyDown={ev => this.onArrowKeys(ev)}
                error={this.getError()}
                aria-autocomplete="list"
                aria-controls={resultsListId(scope)}
                aria-activedescendant={resultsListItemId(scope, selectedItem)}
              />
              <ResultsDropdown
                scope={this.props.scope}
                findResponse={this.state.findResponse}
                selectedItem={selectedItem}
                setSelectedItem={index => this.setSelectedItem(index)}
                onAddressSelected={index => this.onAddressSelected(index)}
              />
            </div>
          </div>
        </Label>
      </div>);
  }
}

export { AddressSearchBox };
