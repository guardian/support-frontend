// @flow
import React, { Component } from 'react';
import { compose } from 'redux';

import Button from 'components/button/button';
import { Input } from 'components/forms/input';
import { Select } from 'components/forms/select';
import { asControlled } from 'hocs/asControlled';
import { withLabel } from 'hocs/withLabel';
import { withError } from 'hocs/withError';

import { type PostcodeFinderState, type PostcodeFinderActionCreators } from './postcodeFinderStore';
import { type Address } from '../helpers/postcodeFinder';

import styles from './postcodeFinder.module.scss';


type PropTypes = {|
  ...PostcodeFinderState,
  ...PostcodeFinderActionCreators,
  onPostcodeUpdate: (string) => void,
  onAddressUpdate: (Address) => void,
  id: string
|};

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
        aria-label={null}
      >
        Find it
      </Button>
    }
  </div>
);

const ComposedInputWithButton = compose(withLabel, asControlled, withError)(InputWithButton);
const ComposedSelect = compose(withLabel)(Select);

export default class PostcodeFinder extends Component<PropTypes> {
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
        />
        {(results.length > 0) &&
          <ComposedSelect
            onChange={(ev) => {
              if (results[ev.target.value]) {
                onAddressUpdate(results[ev.target.value]);
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
