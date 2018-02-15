// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PatronsEvents from 'components/patronsEvents/patronsEvents';

import type { State } from '../supportLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    campaignCode: state.common.referrerAcquisitionData.campaignCode,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PatronsEvents);
