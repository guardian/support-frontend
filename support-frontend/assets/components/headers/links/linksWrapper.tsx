// ----- Imports ----- //

import { connect } from 'react-redux';
import type { Participations } from 'helpers/abTests/abtest';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import Links from './links';

// ----- Types ----- //

type PropTypes = {
	countryGroupId: CountryGroupId;
	abVariant: Participations;
};

// ----- Component ----- //

function LinksWrapper(props: PropTypes) {
	console.log('LinksWrapper:abVariant', props);
	return (
		<Links
			location={'desktop'}
			countryGroupId={props.countryGroupId}
			hideDigital={props.abVariant.newProduct === 'variant'}
		/>
	);
}

// ----- State/Props Maps ----- //

function mapStateToProps(state: State) {
	return {
		countryGroupId: state.common.internationalisation.countryGroupId,
		abVariant: state.common.abParticipations,
	};
}

// ----- Export ----- //

export default connect(mapStateToProps)(LinksWrapper);
