// @flow
import { type Dispatch } from 'redux';
import { type Option } from 'helpers/types/option';

type Address = {|
  addressLine1: string,
  addressLine2?: Option<string>,
  townCity: string,
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
      dispatch({ type: 'FILL_PCFINDER_RESULTS', results: [] });
      dispatch({ type: 'SET_PCFINDER_ERROR', error: 'Ooops this thing failed because of reasons sorry whoopsie daisy we made an owo boingo' });
    }, 2000);
  },
};

export type PostcodeFinderActionCreators = typeof postcodeFinderActionCreators;


const initialState = {
  results: [{
    addressLine1: '7 lollypop ave',
    townCity: 'London',
  }],
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
        results: [...state.results, ...state.results, ...action.results],
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
