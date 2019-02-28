// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Button from 'components/button/button';
import { Input } from 'components/forms/standardFields/input';
import { Select } from 'components/forms/standardFields/select';
import { asControlled } from 'components/forms/formHOCs/asControlled';
import { withLabel } from 'components/forms/formHOCs/withLabel';
import { withError } from 'components/forms/formHOCs/withError';

import { type PostcodeFinderState, type Address, type PostcodeFinderActionCreators, postcodeFinderActionCreators } from './postcodeFinderReducer';

import styles from './postcodeFinder.module.scss';

type PropTypes = {|
  ...PostcodeFinderState,
  ...PostcodeFinderActionCreators,
  onPostcodeUpdate: (string) => void,
  onAddressUpdate: (Address) => void,
  id: string
|};

const InputWithButton = ({ onClick, ...props }) => (
  <div className={styles.root}>
    <Input {...props} name="postcode" />
    <Button type="button" appearance="greyHollow" icon={null} onClick={onClick} aria-label={null}>Find it</Button>
  </div>
);

const ComposedInputWithButton = compose(withLabel, asControlled, withError)(InputWithButton);
const ComposedSelect = compose(withLabel)(Select);

class PostcodeFinder extends Component<PropTypes> {
  componentDidUpdate(prevProps) {
    if (this.selectRef && this.props.results.join() !== prevProps.results.join()) {
      this.selectRef.focus();
    }
  }
  selectRef: (Element & {focus: Function});
  render() {
    const {
      id, postcode, results, setPostcode, fetchResults, error, onPostcodeUpdate, onAddressUpdate,
    } = this.props;
    return (
      <div>
        <ComposedInputWithButton
          error={error}
          label="Postcode"
          onClick={fetchResults}
          id={id}
          setValue={(val) => {
            setPostcode(val);
            onPostcodeUpdate(val);
          }}
          value={postcode}
        />
        {(results.length > 0) &&
          <ComposedSelect
            onChange={(ev) => { if (results[ev.target.value]) { onAddressUpdate(results[ev.target.value]); } }}
            forwardRef={(r) => { this.selectRef = r; }}
            id="address"
            label={`${results.length} addresses found`}
          >
            <option value={null}>Select a postcode</option>
            {results.map((result, key) => (
              <option value={key}>{result.lineOne}</option>
          ))}
          </ComposedSelect>
        }
      </div>
    );
  }
}

// ----- Exports ----- //

export default connect(
  state => ({
    ...state.page.postcodeFinder,
  }),
  postcodeFinderActionCreators,
)(PostcodeFinder);
