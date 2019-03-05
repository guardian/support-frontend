// @flow
import { connect } from 'react-redux';
import { type Address } from '../helpers/addresses';
import PostcodeFinder from './postcodeFinder';
import { type State } from '../paperSubscriptionCheckoutReducer';
import { type PostcodeFinderState, postcodeFinderActionCreatorsFor } from './postcodeFinderStore';

const postcodeFinderFor = (scope: Address, traverseState: State => PostcodeFinderState) => connect(
  traverseState,
  postcodeFinderActionCreatorsFor(scope),
)(PostcodeFinder);

export default postcodeFinderFor;
