// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import type { CommonState } from 'helpers/page/page';

import InternationalSubscriptions from './internationalSubscriptions';


// ----- State Maps ----- //

function mapStateToProps(state: { common: CommonState }) {

  return {
    referrerAcquisitionData: state.common.referrerAcquisitionData,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(InternationalSubscriptions);
