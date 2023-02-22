import { css, ThemeProvider } from '@emotion/react';
import {
	Radio,
	RadioGroup,
	radioThemeBrand,
} from '@guardian/source-react-components';
import { useEffect, useState } from 'react';
import { setUserTypeFromIdentityResponse } from 'helpers/redux/checkout/personalDetails/actions';
import type { UserTypeFromIdentityResponse } from 'helpers/redux/checkout/personalDetails/state';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { setIsSignedIn } from 'helpers/redux/user/actions';

const selectorStyles = css`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 12px;
	font-weight: normal;
`;

export function ThankYouUserTypeSelector(): JSX.Element {
	const [selectedUserType, setSelectedUserType] =
		useState<UserTypeFromIdentityResponse>('guest');

	const dispatch = useContributionsDispatch();
	const { userTypeFromIdentityResponse } = useContributionsSelector(
		(state) => state.page.checkoutForm.personalDetails,
	);

	useEffect(() => {
		if (userTypeFromIdentityResponse === selectedUserType) return;

		switch (selectedUserType) {
			case 'guest':
				dispatch(setUserTypeFromIdentityResponse('guest'));
				dispatch(setIsSignedIn(false));
				return;

			case 'new':
				dispatch(setUserTypeFromIdentityResponse('new'));
				dispatch(setIsSignedIn(false));
				return;

			case 'current':
				dispatch(setUserTypeFromIdentityResponse('current'));
				dispatch(setIsSignedIn(true));
				return;

			default:
				return;
		}
	}, [selectedUserType]);

	return (
		<ThemeProvider theme={radioThemeBrand}>
			<RadioGroup
				error=""
				label="Select a user account type:"
				name="thankYouUserTypeSelector"
				orientation="horizontal"
				cssOverrides={selectorStyles}
			>
				<Radio
					// the default user type response from identity as a test user is "guest"
					defaultChecked
					label="Guest"
					value="guest"
					onChange={() => setSelectedUserType('guest')}
				/>
				<Radio
					label="New"
					value="new"
					onChange={() => setSelectedUserType('new')}
				/>
				<Radio
					label="Existing"
					value="current"
					onChange={() => setSelectedUserType('current')}
				/>
			</RadioGroup>
		</ThemeProvider>
	);
}
