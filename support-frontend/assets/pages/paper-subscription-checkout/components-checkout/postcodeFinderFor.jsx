// @flow
import { connect } from 'react-redux';
import { type Addresses } from '../helpers/addresses';
import PostcodeFinder from './postcodeFinder';
import { type State } from '../paperSubscriptionCheckoutReducer';
import { type PostcodeFinderState, postcodeFinderActionCreatorsFor } from './postcodeFinderStore';

const postcodeFinderFor = (scope: Addresses, traverseState: State => PostcodeFinderState) => connect(
  traverseState,
  postcodeFinderActionCreatorsFor(scope),
)(PostcodeFinder);

export default postcodeFinderFor;
