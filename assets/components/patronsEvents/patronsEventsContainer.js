// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import PatronsEvents from 'components/patronsEvents/patronsEvents';

import type { CommonState } from 'helpers/page/page';


// ----- State Maps ----- //

function mapStateToProps(state: { common: CommonState }) {

  return {
    campaignCode: state.common.referrerAcquisitionData.campaignCode,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(PatronsEvents);
