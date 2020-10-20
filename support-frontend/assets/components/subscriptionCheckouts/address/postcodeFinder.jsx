// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { TextInput } from '@guardian/src-text-input';
import { Button, buttonReaderRevenueBrandAlt } from '@guardian/src-button';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { ThemeProvider } from 'emotion-theming';
import { border } from '@guardian/src-foundations/palette';

import { Select } from 'components/forms/select';
import { withLabel } from 'hocs/withLabel';

import {
  type PostcodeFinderActionCreators,
  postcodeFinderActionCreatorsFor,
  type PostcodeFinderState,
} from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import { type AddressType } from 'helpers/subscriptionsForms/addressType';
import { type PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';

// Styles

const root = css`
  display: flex;
  justify-content: flex-start;
  margin-bottom: ${space[6]}px;
`;

const inputStyles = css`
  margin-right: ${space[3]}px;
`;

const buttonStyles = css`
  align-self: flex-end;
  border: 2px ${border.primary} solid;
`;

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
  <div css={root}>
    <TextInput
      {...props}
      onKeyPress={(ev) => {
        if (ev.key && ev.key === 'Enter') {
          ev.preventDefault();
          onClick();
        }
      }}
      css={inputStyles}
      name="postcode"
      width={10}
    />
    {!isLoading &&
    <ThemeProvider theme={buttonReaderRevenueBrandAlt}>
      <Button
        priority="tertiary"
        css={buttonStyles}
        type="button"
        icon={null}
        onClick={onClick}
      >
        Find address
      </Button>
    </ThemeProvider>
    }
  </div>
);

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
        <InputWithButton
          error={error}
          label="Postcode"
          onClick={() => { fetchResults(postcode); }}
          id={id}
          onChange={(val) => {
            setPostcode(val);
            onPostcodeUpdate(val);
          }}
          isLoading={isLoading}
          value={postcode}
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
