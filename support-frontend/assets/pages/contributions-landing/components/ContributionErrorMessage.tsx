// ----- Imports ----- //

import { connect } from 'react-redux';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import type { ContributionType } from 'helpers/contributions';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import { getContributionType } from 'helpers/redux/checkout/product/selectors';
import type { State } from '../contributionsLandingReducer';
import { ExistingRecurringContributorErrorMessage } from './ExistingRecurringContributorErrorMessage';

// ----- Types ----- //

type PropTypes = {
	contributionType: ContributionType;
	paymentError: ErrorReason | null;
	isSignedIn: boolean;
	formIsValid: boolean;
	isRecurringContributor: boolean;
	checkoutFormHasBeenSubmitted: boolean;
};

const mapStateToProps = (state: State) => ({
	paymentMethod: state.page.form.paymentMethod,
	contributionType: getContributionType(state.page.checkoutForm.product),
	paymentError: state.page.form.paymentError,
	isSignedIn: state.page.user.isSignedIn,
	formIsValid: state.page.form.formIsValid,
	isRecurringContributor: state.page.user.isRecurringContributor,
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
});

// ----- Functions ----- //

// ----- Render ----- //

function ContributionErrorMessage(props: PropTypes) {
	const shouldsShowExistingContributorErrorMessage =
		props.contributionType !== 'ONE_OFF' &&
		props.isRecurringContributor &&
		props.checkoutFormHasBeenSubmitted;

	if (props.paymentError) {
		return <GeneralErrorMessage errorReason={props.paymentError} />;
	} else if (!props.formIsValid && props.checkoutFormHasBeenSubmitted) {
		return (
			<GeneralErrorMessage
				classModifiers={['invalid_form_mobile']}
				errorHeading="Form incomplete"
				errorReason="invalid_form_mobile"
			/>
		);
	} else if (shouldsShowExistingContributorErrorMessage) {
		return (
			<ExistingRecurringContributorErrorMessage
				contributionType={props.contributionType}
				checkoutFormHasBeenSubmitted={props.checkoutFormHasBeenSubmitted}
				isRecurringContributor={props.isRecurringContributor}
			/>
		);
	}

	return null;
}

export default connect(mapStateToProps)(ContributionErrorMessage);
