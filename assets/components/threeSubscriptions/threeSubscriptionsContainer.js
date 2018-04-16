// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';

import type { CommonState } from 'helpers/page/page';


// ----- State Maps ----- //

function mapStateToProps(state: { common: CommonState }) {

  return {
    referrerAcquisitionData: state.common.referrerAcquisitionData,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ThreeSubscriptions);
