// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';

import type { State } from '../subscriptionsLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    referrerAcquisitionData: state.common.referrerAcquisitionData,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ThreeSubscriptions);
