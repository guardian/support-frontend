// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import LegalSection from './legalSection';

// ----- State Maps ----- //

const mapStateToProps = state => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
});

// ----- Exports ----- //

export default connect(mapStateToProps)(LegalSection);
