// ----- Imports ----- //

import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { getAllErrorsForContributions } from 'helpers/redux/checkout/checkoutSelectors';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { ExistingRecurringContributorErrorMessage } from './ExistingRecurringContributorErrorMessage';

const mapStateToProps = (state: ContributionsState) => ({
	paymentMethod: state.page.checkoutForm.payment.paymentMethod,
	contributionType: getContributionType(state),
	paymentError: state.page.form.paymentError,
	isSignedIn: state.page.user.isSignedIn,
	formIsValid: state.page.form.formIsValid,
	allErrors: getAllErrorsForContributions(state),
	isRecurringContributor: state.page.user.isRecurringContributor,
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
});

const connector = connect(mapStateToProps);

type PropTypes = ConnectedProps<typeof connector>;

// ----- Functions ----- //

// ----- Render ----- //

function ContributionErrorMessage(props: PropTypes) {
	const shouldsShowExistingContributorErrorMessage =
		props.contributionType !== 'ONE_OFF' &&
		props.isRecurringContributor &&
		props.checkoutFormHasBeenSubmitted;

	// if (props.paymentError) {
	// 	return <GeneralErrorMessage errorReason={props.paymentError} />;
	// } else if (!props.formIsValid && props.checkoutFormHasBeenSubmitted) {
	return (
		<div>
			Errors:
			<ul>
				{Object.entries(props.allErrors).map(([fieldName, errors]) => {
					return errors?.map((errorText) => (
						<li>
							<a
								href={`#contribution${fieldName[0].toUpperCase()}${fieldName.slice(
									1,
								)}`}
							>
								{errorText}
							</a>
						</li>
					));
				})}
			</ul>
		</div>
	);
	// } else if (shouldsShowExistingContributorErrorMessage) {
	// 	return (
	// 		<ExistingRecurringContributorErrorMessage
	// 			contributionType={props.contributionType}
	// 			checkoutFormHasBeenSubmitted={props.checkoutFormHasBeenSubmitted}
	// 			isRecurringContributor={props.isRecurringContributor}
	// 		/>
	// 	);
	// }

	return null;
}

export default connector(ContributionErrorMessage);
