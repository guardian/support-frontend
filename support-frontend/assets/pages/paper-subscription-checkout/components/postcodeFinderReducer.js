// @flow
import { type Dispatch } from 'redux';
import { type Option } from 'helpers/types/option';
import { getAddressesForPostcode, type Address } from '../helpers/postcodeFinder';

export type PostcodeFinderState = {|
  results: Address[],
  isLoading: boolean,
  postcode: Option<string>,
  error: Option<string>,
|}

export type PostcodeFinderActions =
  {|type: 'FILL_POSTCODE_FINDER_RESULTS', results: Address[]|} |
  {|type: 'SET_POSTCODE_FINDER_ERROR', error: Option<string>|} |
  {|type: 'START_POSTCODE_FINDER_FETCH_RESULTS' |} |
  {|type: 'SET_POSTCODE_FINDER_POSTCODE', postcode: Option<string>|};

export const postcodeFinderActionCreators = {
  setPostcode: (postcode: string) => ({ type: 'SET_POSTCODE_FINDER_POSTCODE', postcode }),
  fetchResults: (postcode: Option<string>) => (dispatch: Dispatch<PostcodeFinderActions>) => {
    if (!postcode) {
      dispatch({ type: 'SET_POSTCODE_FINDER_ERROR', error: 'Ya need a postcode lass' });
    } else {
      dispatch({ type: 'START_POSTCODE_FINDER_FETCH_RESULTS' });
      getAddressesForPostcode(postcode)
        .then((results) => {
          dispatch({ type: 'FILL_POSTCODE_FINDER_RESULTS', results });
        })
        .catch((error) => {
          console.error(error);
          dispatch({ type: 'SET_POSTCODE_FINDER_ERROR', error: 'This failed' });
        });
    }
  },
};

export type PostcodeFinderActionCreators = typeof postcodeFinderActionCreators;


const initialState = {
  results: [],
  isLoading: false,
  postcode: null,
  error: null,
};

const postcodeFinderReducer = (
  state: PostcodeFinderState = initialState,
  action: PostcodeFinderActions,
): PostcodeFinderState => {

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

export { postcodeFinderReducer };
