// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import type { CommonState } from 'helpers/page/page';

import DigitalSubscriptions from './digitalSubscriptions';


// ----- State Maps ----- //

function mapStateToProps(state: { common: CommonState }) {

  return {
    referrerAcquisitionData: state.common.referrerAcquisitionData,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(DigitalSubscriptions);
