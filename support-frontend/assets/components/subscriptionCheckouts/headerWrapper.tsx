// ----- Imports ----- //

import { connect } from 'react-redux';
import Header from 'components/headers/header/header';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { Stage } from 'helpers/subscriptionsForms/formFields';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';

// ----- Types ----- //

type PropTypes = {
	stage: Stage;
	countryGroupId: CountryGroupId;
};

// ----- State/Props Maps ----- //

function mapStateToProps(state: WithDeliveryCheckoutState) {
	return {
		stage: state.page.checkout.stage,
		countryGroupId: state.common.internationalisation.countryGroupId,
	};
}

// ----- Component ----- //

function HeaderWrapper(props: PropTypes) {
	return (
		<Header
			display={props.stage === 'checkout' ? 'checkout' : 'guardianLogo'}
			countryGroupId={props.countryGroupId}
		/>
	);
}

// ----- Export ----- //

export default connect(mapStateToProps)(HeaderWrapper);
