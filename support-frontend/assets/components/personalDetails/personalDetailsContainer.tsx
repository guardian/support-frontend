import Signout from 'components/signout/signout';
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
import type { PersonalDetailsProps } from './personalDetails';
import { StateSelect } from './stateSelect';

type PersonalDetailsContainerProps = {
	renderPersonalDetails: (props: PersonalDetailsProps) => JSX.Element;
};

export function PersonalDetailsContainer({
	renderPersonalDetails,
}: PersonalDetailsContainerProps): JSX.Element {
	const dispatch = useContributionsDispatch();

	const { email, firstName, lastName, errors } = useContributionsSelector(
		(state) => state.page.checkoutForm.personalDetails,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const { state, errorObject } = useContributionsSelector(
		(state) => state.page.checkoutForm.billingAddress.fields,
	);
	const isSignedIn = useContributionsSelector(
		(state) => state.page.user.isSignedIn,
	);
	const countryGroupId = useContributionsSelector(
		(state) => state.common.internationalisation.countryGroupId,
	);

	function onEmailChange(email: string) {
		dispatch(setEmail(email));
	}

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
		isSignedIn,
		onEmailChange,
		onFirstNameChange,
		onLastNameChange,
		errors,
		signOutLink: <Signout isSignedIn={isSignedIn} />,
		contributionState: (
			<StateSelect
				countryGroupId={countryGroupId}
				contributionType={contributionType}
				state={state}
				onStateChange={onBillingStateChange}
				error={errorObject?.state?.[0]}
			/>
		),
	});
}
