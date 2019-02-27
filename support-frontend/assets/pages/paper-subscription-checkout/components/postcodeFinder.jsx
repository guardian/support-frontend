// @flow
import React from 'react';
import { connect } from 'react-redux';

import Button from 'components/button/button';
import { Input } from 'components/forms/standardFields/input';
import { Error } from 'components/forms/standardFields/error';
import { Label } from 'components/forms/standardFields/label';
import { asControlled } from 'components/forms/formHOCs/asControlled';

import { type PostcodeFinderState, type PostcodeFinderActionCreators, postcodeFinderActionCreators } from './postcodeFinderReducer';

type PropTypes = {|
  ...PostcodeFinderState,
  ...PostcodeFinderActionCreators,
  id: string
|};

const ControlledInput = asControlled(Input);

const PostcodeFinder = ({
  id, postcode, results, setPostcode, fetchResults, error,
}: PropTypes) => (
  <div>
    <Error htmlFor={id} error={error}>
      <Label label="Postcode" htmlFor={id}>
        <div className="component-postcode-finder">
          <ControlledInput setValue={setPostcode} value={postcode} setValueid={id} name="postcode" />
          <Button type="button" onClick={fetchResults} aria-label={null}>find it</Button>
        </div>
      </Label>
    </Error>
    {results &&
    <Label htmlFor={null} label="Results">
      {results.map(({ addressLine1 }) => (
        <strong>{addressLine1}</strong>
      ))}
    </Label>
    }
  </div>
);

// ----- Exports ----- //

export default connect(
  state => ({
    ...state.page.postcodeFinder,
  }),
  postcodeFinderActionCreators,
)(PostcodeFinder);
