// @flow
import { connect } from 'react-redux';
import { postcodeFinders, type PostcodeFinders } from '../helpers/postcodeFinders';
import PostcodeFinder from './postcodeFinder';
import { type State } from '../paperSubscriptionCheckoutReducer';

const postcodeFinderFor = (scope: PostcodeFinders) => connect(
  (state: State) => ({
    ...state.page[`${scope}PostcodeFinder`],
  }),
  postcodeFinders.billing.actionCreators,
)(PostcodeFinder);

export default postcodeFinderFor;
