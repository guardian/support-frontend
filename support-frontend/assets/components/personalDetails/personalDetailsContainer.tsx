import Signout from 'components/signout/signout';
import { checkBillingState } from 'helpers/forms/formValidation';
import { setBillingState } from 'helpers/redux/checkout/address/actions';
import {
	setEmail,
	setFirstName,
	setLastName,
} from 'helpers/redux/checkout/personalDetails/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import ContributionState from 'pages/contributions-landing/components/ContributionState';
import type { PersonalDetailsProps } from './personalDetails';

type PersonalDetailsContainerProps = {
	renderPersonalDetails: (props: PersonalDetailsProps) => JSX.Element;
};

export function PersonalDetailsContainer({
	renderPersonalDetails,
}: PersonalDetailsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();

	const { email, firstName, lastName } = useContributionsSelector(
		(state) => state.page.checkoutForm.personalDetails,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const billingState = useContributionsSelector(
		(state) => state.page.checkoutForm.billingAddress.fields.state,
	);
	const checkoutFormHasBeenSubmitted = useContributionsSelector(
		(state) => state.page.form.formData.checkoutFormHasBeenSubmitted,
	);
	function onEmailChange(email: string) {
		dispatch(setEmail(email));
	}
	const isSignedInPersonalDetails = useContributionsSelector(
		(state) => state.page.checkoutForm.personalDetails.isSignedIn,
	);
	const isSignedInUser = useContributionsSelector(
		(state) => state.page.user.isSignedIn,
	);
	const countryGroupId = useContributionsSelector(
		(state) => state.common.internationalisation.countryGroupId,
	);
	function onFirstNameChange(firstName: string) {
		dispatch(setFirstName(firstName));
	}
	function onLastNameChange(lastName: string) {
		dispatch(setLastName(lastName));
	}
	function onBillingStateChange(billingState: string) {
		dispatch(setBillingState(billingState));
	}

	return renderPersonalDetails({
		email,
		firstName,
		lastName,
		contributionType,
		isSignedInPersonalDetails,
		onEmailChange,
		onFirstNameChange,
		onLastNameChange,
		signOutLink: <Signout isSignedIn={isSignedInUser} />,
		contributionState: (
			<ContributionState
				onChange={(newBillingState) => onBillingStateChange(newBillingState)}
				selectedState={billingState}
				isValid={checkBillingState(billingState)}
				formHasBeenSubmitted={checkoutFormHasBeenSubmitted}
				contributionType={contributionType}
				countryGroupId={countryGroupId}
			/>
		),
	});
}
