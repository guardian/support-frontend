import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { Column, Columns, Container } from '@guardian/source-react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { PersonalDetailsProps } from 'components/personalDetails/personalDetails';
import { PersonalDetails } from 'components/personalDetails/personalDetails';
import { StateSelect } from 'components/personalDetails/stateSelect';
import Signout from 'components/signout/signout';
import {
	GBPCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';

export default {
	title: 'Checkouts/Personal Details',
	component: PersonalDetails,
	argTypes: {
		handleButtonClick: { action: 'button clicked' },
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Container backgroundColor={neutral[97]}>
				<Columns
					collapseUntil="tablet"
					cssOverrides={css`
						justify-content: center;
						padding: 1rem 0;
					`}
				>
					<Column width={[1, 3 / 4, 1 / 2]}>
						<Box>
							<BoxContents>
								<Story />
							</BoxContents>
						</Box>
					</Column>
				</Columns>
			</Container>
		),
	],
};

function Template(args: PersonalDetailsProps) {
	return <PersonalDetails {...args} />;
}

Template.args = {} as Omit<
	PersonalDetailsProps,
	| 'handleButtonClick'
	| 'onEmailChange'
	| 'onFirstNameChange'
	| 'onLastNameChange'
>;

export const SingleContribSignedIn = Template.bind({});

SingleContribSignedIn.args = {
	email: '',
	firstName: '',
	lastName: '',
	contributionType: 'ONE_OFF',
	isSignedInPersonalDetails: false,
	signOutLink: <Signout isSignedIn={true} />,
	contributionState: (
		<StateSelect
			state=""
			onStateChange={() => null}
			countryGroupId={GBPCountries}
		/>
	),
};

export const SingleContribSignedOut = Template.bind({});

SingleContribSignedOut.args = {
	email: '',
	firstName: '',
	lastName: '',
	contributionType: 'ONE_OFF',
	isSignedInPersonalDetails: false,
	signOutLink: <Signout isSignedIn={false} />,
	contributionState: (
		<StateSelect
			state=""
			onStateChange={() => null}
			countryGroupId={GBPCountries}
		/>
	),
};

export const MultiContribSignedIn = Template.bind({});

MultiContribSignedIn.args = {
	email: '',
	firstName: '',
	lastName: '',
	contributionType: 'MONTHLY',
	isSignedInPersonalDetails: false,
	signOutLink: <Signout isSignedIn={true} />,
	contributionState: (
		<StateSelect
			state=""
			onStateChange={() => null}
			countryGroupId={GBPCountries}
		/>
	),
};

export const MultiContribSignedOut = Template.bind({});

MultiContribSignedOut.args = {
	email: '',
	firstName: '',
	lastName: '',
	contributionType: 'MONTHLY',
	isSignedInPersonalDetails: false,
	signOutLink: <Signout isSignedIn={false} />,
	contributionState: (
		<StateSelect
			state=""
			onStateChange={() => null}
			countryGroupId={GBPCountries}
		/>
	),
};

export const MultiContribUSSignedIn = Template.bind({});

MultiContribUSSignedIn.args = {
	email: '',
	firstName: '',
	lastName: '',
	contributionType: 'MONTHLY',
	isSignedInPersonalDetails: false,
	signOutLink: <Signout isSignedIn={true} />,
	contributionState: (
		<StateSelect
			state=""
			onStateChange={() => null}
			countryGroupId={UnitedStates}
		/>
	),
};

export const MultiContribUSSignedOut = Template.bind({});

MultiContribUSSignedOut.args = {
	email: '',
	firstName: '',
	lastName: '',
	contributionType: 'MONTHLY',
	isSignedInPersonalDetails: false,
	signOutLink: <Signout isSignedIn={false} />,
	contributionState: (
		<StateSelect
			state=""
			onStateChange={() => null}
			countryGroupId={UnitedStates}
		/>
	),
};

export const WithErrors = Template.bind({});

WithErrors.args = {
	email: '',
	firstName: '',
	lastName: '',
	contributionType: 'MONTHLY',
	isSignedInPersonalDetails: false,
	errors: {
		firstName: ['Please enter your first name'],
		lastName: ['Please enter your last name'],
		email: ['Please enter your email address'],
	},
	signOutLink: <Signout isSignedIn={false} />,
	contributionState: (
		<StateSelect
			state=""
			error="Please select your state, province or territory"
			onStateChange={() => null}
			countryGroupId={UnitedStates}
		/>
	),
};
