// @flow
import { type Dispatch } from 'redux';

import { type Option } from 'helpers/types/option';
import { type Scoped } from 'helpers/scoped';
import { type Address } from '../helpers/addresses';
import { getAddressesForPostcode, type PostcodeFinderResult } from '../helpers/postcodeFinder';

export type PostcodeFinderState = {|
  results: PostcodeFinderResult[],
  isLoading: boolean,
  postcode: Option<string>,
  error: Option<string>,
|}

export type PostcodeFinderActions =
  {|type: 'FILL_POSTCODE_FINDER_RESULTS', results: PostcodeFinderResult[], ...Scoped<Address> |} |
  {|type: 'SET_POSTCODE_FINDER_ERROR', error: Option<string>, ...Scoped<Address> |} |
  {|type: 'START_POSTCODE_FINDER_FETCH_RESULTS', ...Scoped<Address> |} |
  {|type: 'SET_POSTCODE_FINDER_POSTCODE', ...Scoped<Address>, postcode: Option<string> |};

const postcodeFinderActionCreatorsFor = (scope: Address) => ({
  setPostcode: (postcode: string) => ({ type: 'SET_POSTCODE_FINDER_POSTCODE', postcode, scope }),
  fetchResults: (postcode: Option<string>) => (dispatch: Dispatch<PostcodeFinderActions>) => {
    if (!postcode) {
      dispatch({
        type: 'SET_POSTCODE_FINDER_ERROR',
        error: 'Please enter a postcode',
        scope,
      });
    } else {
      dispatch({ type: 'START_POSTCODE_FINDER_FETCH_RESULTS', scope });
      getAddressesForPostcode(postcode)
        .then((results) => {
          dispatch({
            type: 'FILL_POSTCODE_FINDER_RESULTS',
            results,
            scope,
          });
        })
        .catch(() => {
          dispatch({
            type: 'SET_POSTCODE_FINDER_ERROR',
            error: 'Couldn\'t find your postcode',
            scope,
          });
        });
    }
  },
});

export type PostcodeFinderActionCreators = $Call<typeof postcodeFinderActionCreatorsFor, Address>;

const initialState = {
  results: [],
  isLoading: false,
  postcode: null,
  error: null,
};

const postcodeFinderReducerFor = (scope: Address) => (
  state: PostcodeFinderState = initialState,
  action: PostcodeFinderActions,
): PostcodeFinderState => {

  if (action.scope !== scope) {
    return state;
  }

  switch (action.type) {
    case 'FILL_POSTCODE_FINDER_RESULTS':
      return {
        ...state,
        isLoading: false,
        results: action.results,
      };
    case 'SET_POSTCODE_FINDER_POSTCODE':
      return {
        ...state,
        results: [],
        postcode: action.postcode,
      };
    case 'SET_POSTCODE_FINDER_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    case 'START_POSTCODE_FINDER_FETCH_RESULTS':
      return {
        ...initialState,
        error: null,
        isLoading: true,
        postcode: state.postcode,
      };
    default:
      return state;
  }

};

export { postcodeFinderReducerFor, postcodeFinderActionCreatorsFor };

