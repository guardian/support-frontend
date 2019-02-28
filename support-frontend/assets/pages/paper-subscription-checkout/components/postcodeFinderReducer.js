// @flow
import { type Dispatch } from 'redux';
import { type Option } from 'helpers/types/option';

export type Address = {|
  lineOne?: string,
  lineTwo?: string,
  city?: string,
|};

export type PostcodeFinderState = {|
  results: Address[],
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
  fetchResults: () => (dispatch: Dispatch<PostcodeFinderActions>) => {
    dispatch({ type: 'START_POSTCODE_FINDER_FETCH_RESULTS' });
    setTimeout(() => {
      dispatch({ type: 'SET_POSTCODE_FINDER_ERROR', error: 'This failed (predictably) because it\'s not linked to the backend yet' });
    }, 2000);
  },
};

export type PostcodeFinderActionCreators = typeof postcodeFinderActionCreators;


const initialState = {
  results: [],
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
      };
    case 'SET_POSTCODE_FINDER_POSTCODE':
      return {
        ...state,
        postcode: action.postcode,
      };
    case 'SET_POSTCODE_FINDER_ERROR':
      return {
        ...state,
        error: action.error,
      };
    case 'START_POSTCODE_FINDER_FETCH_RESULTS':
      return {
        ...initialState,
        postcode: state.postcode,
      };
    default:
      return state;
  }

};

export { postcodeFinderReducer };
