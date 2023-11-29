import { TextInput } from '@guardian/source-react-components';
import Signout from 'components/signout/signout';
import {
	setBillingPostcode,
	setBillingState,
} from 'helpers/redux/checkout/address/actions';
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
	const { state, postCode, errorObject } = useContributionsSelector(
		(state) => state.page.checkoutForm.billingAddress.fields,
	);
	const isSignedIn = useContributionsSelector(
		(state) => state.page.user.isSignedIn,
	);
	const countryId = useContributionsSelector(
		(state) => state.common.internationalisation.countryId,
	);

	const showZipCodeField = countryId === 'US';

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

	function onZipCodeChange(newZipCode: string) {
		dispatch(setBillingPostcode(newZipCode));
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
		signOutLink: <Signout isSignedIn={isSignedIn} returnUrl={window.location.href} />,
		contributionState: (
			<StateSelect
				countryId={countryId}
				contributionType={contributionType}
				state={state}
				onStateChange={onBillingStateChange}
				error={errorObject?.state?.[0]}
			/>
		),
		contributionZipcode: showZipCodeField ? (
			<div>
				<TextInput
					id="zipCode"
					name="zip-code"
					label="ZIP code"
					value={postCode}
					error={errorObject?.postCode?.[0]}
					onChange={(e) => onZipCodeChange(e.target.value)}
				/>
			</div>
		) : undefined,
	});
}
