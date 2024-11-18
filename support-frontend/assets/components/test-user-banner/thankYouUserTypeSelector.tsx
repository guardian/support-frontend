import { css, ThemeProvider } from '@emotion/react';
import {
	Radio,
	RadioGroup,
	radioThemeBrand,
} from '@guardian/source/react-components';
import { useEffect, useState } from 'react';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';

const selectorStyles = css`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 12px;
	font-weight: normal;
`;

export function ThankYouUserTypeSelector(): JSX.Element {
	const [selectedUserType, setSelectedUserType] = useState<UserType>('guest');

	useEffect(() => {
		// ToDo: refactor this to use the query param instead of redux
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
