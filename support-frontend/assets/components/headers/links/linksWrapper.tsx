// ----- Imports ----- //

import { connect } from 'react-redux';
import type { Participations } from 'helpers/abTests/abtest';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import Links from './links';

// menuRef: Element | null | undefined;

// ----- Types ----- //

type PropTypes = {
	countryGroupId: CountryGroupId;
	abVariant: Participations;
};

// ----- Component ----- //

function LinksWrapper(props: PropTypes) {
	console.log('LinksWrapper:abVariant', props);
	return (
		// <a className="component-signout"> {props.abVariant.newProduct}</a>
		<Links
			location={'desktop'}
			countryGroupId={props.countryGroupId}
			hideDigital={props.abVariant.newProduct === 'variant'}
			// getRef={(el) => {
			// 	this.menuRef = el;
			// }}
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
