import '__mocks__/settingsMock';
import { Provider } from 'react-redux';
import { createTestStoreForContributions } from '__test-utils__/testStore';
import {
	setEmail,
	setFirstName,
	setLastName,
	setUserTypeFromIdentityResponse,
} from 'helpers/redux/checkout/personalDetails/actions';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import { setCountryInternationalisation } from 'helpers/redux/commonState/actions';
import { defaultUserActionFunctions } from 'helpers/user/defaultUserActionFunctions';
import { SupporterPlusThankYou } from 'pages/supporter-plus-thank-you/supporterPlusThankYou';

export default {
	component: SupporterPlusThankYou,
	title: 'Screens/Supporter Plus Thank You Page',
};

function Template() {
	return <SupporterPlusThankYou />;
}

Template.args = {} as Record<string, unknown>;
// docs for title (if name available) and subtitle copy (marketing)
Template.parameters = {} as Record<string, unknown>;
Template.decorators = [] as unknown[];

export const AustraliaExistingAccountNotSignedIn = Template.bind({});

AustraliaExistingAccountNotSignedIn.decorators = [
	(Story: React.FC): JSX.Element => {
		const store = createTestStoreForContributions();

		store.dispatch(setFirstName('Joe'));
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@guardian.com'));

		store.dispatch(setCountryInternationalisation('AU'));

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];

export const ExistingAccountNotSignedIn = Template.bind({});

ExistingAccountNotSignedIn.decorators = [
	(Story: React.FC): JSX.Element => {
		const store = createTestStoreForContributions();

		store.dispatch(setFirstName('Joe'));
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@guardian.com'));

		// is not a new account
		store.dispatch(setUserTypeFromIdentityResponse('noRequestSent'));
		store.dispatch(defaultUserActionFunctions.setIsSignedIn(false));

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];

export const ExistingAccountSignedIn = Template.bind({});

ExistingAccountSignedIn.decorators = [
	(Story: React.FC): JSX.Element => {
		const store = createTestStoreForContributions();

		store.dispatch(setFirstName('Joe'));
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@guardian.com'));

		// is not a new account
		store.dispatch(setUserTypeFromIdentityResponse('noRequestSent'));
		store.dispatch(defaultUserActionFunctions.setIsSignedIn(true));

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];

export const NewAccountSignUp = Template.bind({});

NewAccountSignUp.decorators = [
	(Story: React.FC): JSX.Element => {
		const store = createTestStoreForContributions();

		store.dispatch(setFirstName('Joe'));
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@guardian.com'));

		// is a new account
		store.dispatch(setUserTypeFromIdentityResponse('new'));

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];

export const OneOffContributionSupportReminderAndMarketing = Template.bind({});

OneOffContributionSupportReminderAndMarketing.decorators = [
	(Story: React.FC): JSX.Element => {
		const store = createTestStoreForContributions();

		store.dispatch(setFirstName('Joe'));
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@guardian.com'));

		store.dispatch(setProductType('ONE_OFF'));

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];
