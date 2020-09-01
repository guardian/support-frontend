// @flow
import React from 'react';
import { connect } from 'react-redux';
import { type State } from '../../contributionsLandingReducer';
import OldContributionThankYou from './old-flow/ContributionThankYouContainer';
import NewContribtuionThankYou from './new-flow/ContributionThankYou';

type ContributionThankYouProps = {|
  shouldShowNewFlow: boolean,
|};

const mapStateToProps = (state: State) => ({
  shouldShowNewFlow: state.common.abParticipations.newThankYouFlowR1 === 'newFlow',
});

const ContributionThankYou = ({ shouldShowNewFlow }: ContributionThankYouProps) => (
  shouldShowNewFlow ? <NewContribtuionThankYou /> : <OldContributionThankYou />
);

export default connect(mapStateToProps)(ContributionThankYou);
