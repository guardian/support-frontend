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
  {|type: 'FILL_PCFINDER_RESULTS', results: Address[]|} |
  {|type: 'SET_PCFINDER_ERROR', error: Option<string>|} |
  {|type: 'START_PCFINDER_FETCH_RESULTS' |} |
  {|type: 'SET_PCFINDER_POSTCODE', postcode: Option<string>|};

export const postcodeFinderActionCreators = {
  setPostcode: (postcode: string) => ({ type: 'SET_PCFINDER_POSTCODE', postcode }),
  fetchResults: () => (dispatch: Dispatch<PostcodeFinderActions>) => {
    dispatch({ type: 'START_PCFINDER_FETCH_RESULTS' });
    setTimeout(() => {
      dispatch({ type: 'SET_PCFINDER_ERROR', error: 'This failed (predictably) because it\'s not linked to the backend yet' });
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
    case 'FILL_PCFINDER_RESULTS':
      return {
        ...state,
      };
    case 'SET_PCFINDER_POSTCODE':
      return {
        ...state,
        postcode: action.postcode,
      };
    case 'SET_PCFINDER_ERROR':
      return {
        ...state,
        error: action.error,
      };
    case 'START_PCFINDER_FETCH_RESULTS':
      return {
        ...initialState,
        postcode: state.postcode,
      };
    default:
      return state;
  }

};

export { postcodeFinderReducer };
