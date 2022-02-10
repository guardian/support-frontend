// ----- Imports ----- //
import { connect } from 'react-redux';
import type { ContributionType } from 'helpers/contributions';
import 'helpers/contributions';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import 'helpers/forms/errorReasons';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import type { State } from '../contributionsLandingReducer';
import '../contributionsLandingReducer';
import { ExistingRecurringContributorErrorMessage } from './ExistingRecurringContributorErrorMessage';
// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
	contributionType: ContributionType;
	paymentError: ErrorReason | null;
	isSignedIn: boolean;
	formIsValid: boolean;
	isRecurringContributor: boolean;
	checkoutFormHasBeenSubmitted: boolean;
};

/* eslint-enable react/no-unused-prop-types */
const mapStateToProps = (state: State) => ({
	paymentMethod: state.page.form.paymentMethod,
	contributionType: state.page.form.contributionType,
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
