// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import type { CommonState } from 'helpers/page/page';

import Footer from './footer';


// ----- State Maps ----- //

function mapStateToProps(state: { common: CommonState }) {

  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(Footer);
