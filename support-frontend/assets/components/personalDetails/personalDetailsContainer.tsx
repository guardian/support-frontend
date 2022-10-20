import {
	setEmail,
	setFirstName,
	setLastName,
} from 'helpers/redux/checkout/personalDetails/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
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

	function onEmailChange(email: string) {
		dispatch(setEmail(email));
	}

	function onFirstNameChange(email: string) {
		dispatch(setFirstName(email));
	}

	function onLastNameChange(email: string) {
		dispatch(setLastName(email));
	}

	return renderPersonalDetails({
		email,
		firstName,
		lastName,
		onEmailChange,
		onFirstNameChange,
		onLastNameChange,
	});
}
