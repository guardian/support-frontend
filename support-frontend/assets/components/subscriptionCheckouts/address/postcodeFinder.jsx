// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput } from '@guardian/src-text-input';
import { Button, buttonReaderRevenueBrandAlt } from '@guardian/src-button';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { ThemeProvider } from 'emotion-theming';
import { Select, Option } from '@guardian/src-select';

import {
  type PostcodeFinderActionCreators,
  postcodeFinderActionCreatorsFor,
  type PostcodeFinderState,
} from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import { type AddressType } from 'helpers/subscriptionsForms/addressType';
import { type PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';

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
      onKeyPress={(e) => {
        if (e.key && e.key === 'Enter') {
          e.preventDefault();
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
          onChange={(e) => {
            setPostcode(e.target.value);
            onPostcodeUpdate(e.target.value);
          }}
          isLoading={isLoading}
          value={postcode}
        />
        {(results.length > 0) &&
          <Select
            onChange={(e) => {
              if (results[e.currentTarget.value]) {
                onAddressUpdate(results[e.currentTarget.value]);
              }
            }}
            forwardRef={(r) => { this.selectRef = r; }}
            id="address"
            label={`${results.length} addresses found`}
          >
            <Option value={null}>Select an address</Option>
              {results.map((result, key) => (
                <Option value={key}>{[result.lineOne, result.lineTwo].join(', ')}</Option>
              ))}
          </Select>
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
