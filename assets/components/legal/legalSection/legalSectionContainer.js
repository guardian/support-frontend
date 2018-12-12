// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import LegalSection from './legalSection';

// ----- State Maps ----- //

const mapStateToProps = state => ({
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form ? state.page.form.contributionType : '',
});

// ----- Exports ----- //

export default connect(mapStateToProps)(LegalSection);
