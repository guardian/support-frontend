// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PatronsEvents, {PatronEventsLeft} from 'components/patronsEvents/patronsEvents';

import type { CommonState } from 'helpers/page/commonReducer';


// ----- State Maps ----- //

function mapStateToProps(state: { common: CommonState }) {

  return {
    campaignCode: state.common.referrerAcquisitionData.campaignCode,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PatronEventsLeft);
