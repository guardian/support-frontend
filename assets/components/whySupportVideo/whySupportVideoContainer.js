// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import WhySupportVideo from 'components/whySupportVideo/whySupportVideo';

import { type CommonState } from 'helpers/page/page';


// ----- Types and Map State/Props ----- //

function mapStateToProps(state: { common: CommonState }) {
  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
  };
}


// ----- Exports ----- //

export default connect(mapStateToProps)(WhySupportVideo);
