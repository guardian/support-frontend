// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import Countdown from 'components/countdown/countdown';


// ----- State Maps ----- //

function mapStateToProps(state) {
  return {
    unixTimeLeft: state.page.flashCountdown,
  };
}


// ----- Exports ----- //

export default connect(mapStateToProps)(Countdown);
