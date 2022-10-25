import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { Column, Columns, Container } from '@guardian/source-react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { PersonalDetailsProps } from 'components/personalDetails/personalDetails';
import { PersonalDetails } from 'components/personalDetails/personalDetails';
import Signout from 'components/signout/signout';
import {
	GBPCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import ContributionState from 'pages/contributions-landing/components/ContributionState';

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
	checkoutFormHasBeenSubmitted: false,
	contributionType: 'ONE_OFF',
	isSignedInPersonalDetails: false,
	userTypeFromIdentityResponse: 'requestPending',
	signOutLink: <Signout isSignedIn={true} />,
	contributionState: (
		<ContributionState
			selectedState={null}
			onChange={() => null}
			isValid={false}
			formHasBeenSubmitted={false}
			contributionType={'ONE_OFF'}
			countryGroupId={GBPCountries}
		/>
	),
};

export const SingleContribSignedOut = Template.bind({});

SingleContribSignedOut.args = {
	email: '',
	firstName: '',
	lastName: '',
	checkoutFormHasBeenSubmitted: false,
	contributionType: 'ONE_OFF',
	isSignedInPersonalDetails: false,
	userTypeFromIdentityResponse: 'requestPending',
	signOutLink: <Signout isSignedIn={false} />,
	contributionState: (
		<ContributionState
			selectedState={null}
			onChange={() => null}
			isValid={false}
			formHasBeenSubmitted={false}
			contributionType={'ONE_OFF'}
			countryGroupId={GBPCountries}
		/>
	),
};

export const MultiContribSignedIn = Template.bind({});

MultiContribSignedIn.args = {
	email: '',
	firstName: '',
	lastName: '',
	checkoutFormHasBeenSubmitted: false,
	contributionType: 'MONTHLY',
	isSignedInPersonalDetails: false,
	userTypeFromIdentityResponse: 'requestPending',
	signOutLink: <Signout isSignedIn={true} />,
	contributionState: (
		<ContributionState
			selectedState={null}
			onChange={() => null}
			isValid={false}
			formHasBeenSubmitted={false}
			contributionType={'MONTHLY'}
			countryGroupId={GBPCountries}
		/>
	),
};

export const MultiContribSignedOut = Template.bind({});

MultiContribSignedOut.args = {
	email: '',
	firstName: '',
	lastName: '',
	checkoutFormHasBeenSubmitted: false,
	contributionType: 'MONTHLY',
	isSignedInPersonalDetails: false,
	userTypeFromIdentityResponse: 'requestPending',
	signOutLink: <Signout isSignedIn={false} />,
	contributionState: (
		<ContributionState
			selectedState={null}
			onChange={() => null}
			isValid={false}
			formHasBeenSubmitted={false}
			contributionType={'MONTHLY'}
			countryGroupId={GBPCountries}
		/>
	),
};

export const MultiContribUSSignedIn = Template.bind({});

MultiContribUSSignedIn.args = {
	email: '',
	firstName: '',
	lastName: '',
	checkoutFormHasBeenSubmitted: false,
	contributionType: 'MONTHLY',
	isSignedInPersonalDetails: false,
	userTypeFromIdentityResponse: 'requestPending',
	signOutLink: <Signout isSignedIn={true} />,
	contributionState: (
		<ContributionState
			selectedState={null}
			onChange={() => null}
			isValid={false}
			formHasBeenSubmitted={false}
			contributionType={'MONTHLY'}
			countryGroupId={UnitedStates}
		/>
	),
};

export const MultiContribUSSignedOut = Template.bind({});

MultiContribUSSignedOut.args = {
	email: '',
	firstName: '',
	lastName: '',
	checkoutFormHasBeenSubmitted: false,
	contributionType: 'MONTHLY',
	isSignedInPersonalDetails: false,
	userTypeFromIdentityResponse: 'requestPending',
	signOutLink: <Signout isSignedIn={false} />,
	contributionState: (
		<ContributionState
			selectedState={null}
			onChange={() => null}
			isValid={false}
			formHasBeenSubmitted={false}
			contributionType={'MONTHLY'}
			countryGroupId={UnitedStates}
		/>
	),
};
