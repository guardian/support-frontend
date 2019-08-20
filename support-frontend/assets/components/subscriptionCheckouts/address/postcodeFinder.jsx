// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Button from 'components/button/button';
import { Input } from 'components/forms/input';
import { Select } from 'components/forms/select';
import { asControlled } from 'hocs/asControlled';
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';

import {
  type PostcodeFinderActionCreators,
  postcodeFinderActionCreatorsFor,
  type PostcodeFinderState,
} from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import { type AddressType } from 'helpers/subscriptionsForms/addressType';
import { type PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';

import styles
  from 'components/subscriptionCheckouts/address/postcodeFinder.module.scss';

// Types

type PropTypes = {|
  onPostcodeUpdate: (string) => any,
  onAddressUpdate: (PostcodeFinderResult) => any,
  id: string,
  ...PostcodeFinderState,
  ...PostcodeFinderActionCreators,
|};


// Helpers
const InputWithButton = ({ onClick, isLoading, ...props }) => (
  <div className={styles.root}>
    <Input
      {...props}
      onKeyPress={(ev) => {
        if (ev.key && ev.key === 'Enter') {
          ev.preventDefault();
          onClick();
        }
      }}
      className={styles.input}
      name="postcode"
    />
    {!isLoading &&
      <Button
        type="button"
        appearance="greyHollow"
        icon={null}
        onClick={onClick}
      >
        Find address
      </Button>
    }
  </div>
);

const ComposedInputWithButton = compose(withLabel, asControlled, withError)(InputWithButton);
const ComposedSelect = compose(withLabel)(Select);

// Main class

class PostcodeFinder extends Component<PropTypes> {
  componentDidUpdate(prevProps: PropTypes) {
    if (this.selectRef && this.props.results.join() !== prevProps.results.join()) {
      this.selectRef.focus();
    }
  }
  selectRef: (Element & {focus: Function});
  render() {
    const {
      id, postcode, results, isLoading, setPostcode, fetchResults, error, onPostcodeUpdate, onAddressUpdate,
    } = this.props;
    return (
      <div>
        <ComposedInputWithButton
          error={error}
          label="Postcode"
          onClick={() => { fetchResults(postcode); }}
          id={id}
          setValue={(val) => {
            setPostcode(val);
            onPostcodeUpdate(val);
          }}
          isLoading={isLoading}
          value={postcode}
          results={results}
        />

        {(results.length > 0) &&
          <ComposedSelect
            onChange={(ev) => {
              if (results[ev.currentTarget.value]) {
                onAddressUpdate(results[ev.currentTarget.value]);
              }
            }}
            forwardRef={(r) => { this.selectRef = r; }}
            id="address"
            label={`${results.length} addresses found`}
          >
            <option value={null}>Select an address</option>
              {results.map((result, key) => (
                <option value={key}>{[result.lineOne, result.lineTwo].join(', ')}</option>
              ))}
          </ComposedSelect>
        }
      </div>
    );
  }
}

export const withStore = <GlobalState>(scope: AddressType, traverseState: GlobalState => PostcodeFinderState) =>
  connect(
    traverseState,
    postcodeFinderActionCreatorsFor(scope),
  )(PostcodeFinder);
