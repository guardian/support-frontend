import { fireEvent, render, screen } from '@testing-library/react';
import { before, forEach } from 'lodash';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import PersonalDetails from './personalDetails';

describe('Personal Details', () => {
	const isSignedIn = false;
	const formErrors: Array<FormError<FormField>> = [];
	const setFirstName = jest.fn();
	const setLastName = jest.fn();
	const setEmail = jest.fn();
	const setConfirmEmail = jest.fn();
	const fetchAndStoreUserType = jest.fn();
	const setTelephone = jest.fn();
	const signOut = jest.fn();
	const defaultProps = {
		firstName: '',
		lastName: '',
		email: '',
		confirmEmail: '',
	};

	const renderPersonalDetails = ({
		firstName,
		lastName,
		email,
		confirmEmail,
	}: {
		firstName: string;
		lastName: string;
		email: string;
		confirmEmail: string;
	}) => {
		render(
			<PersonalDetails
				firstName={firstName}
				lastName={lastName}
				email={email}
				confirmEmail={confirmEmail}
				isSignedIn={isSignedIn}
				formErrors={formErrors}
				setFirstName={setFirstName}
				setLastName={setLastName}
				setEmail={setEmail}
				setConfirmEmail={setConfirmEmail}
				fetchAndStoreUserType={fetchAndStoreUserType}
				setTelephone={setTelephone}
				signOut={signOut}
			/>,
		);
	};

	it('PII fields are in Quantum Metrics Blocklist', () => {
		renderPersonalDetails(defaultProps);

		const elementTestIds = [
			'first-name',
			'last-name',
			'email',
			'confirm-email',
			'telephone',
		];

		elementTestIds.forEach((elementTestId) => {
			const element = screen.getByTestId(elementTestId);
			expect(element).toBeInTheDocument();
			expect(element.dataset.qmMasking).toBe('blocklist');
		});
	});

	describe('onChange handlers', () => {
		const elementsToTest = [
			{
				elementTestId: 'first-name',
				value: 'Waldo',
				onChangeHandler: setFirstName,
			},
			{
				elementTestId: 'last-name',
				value: 'Jeffers',
				onChangeHandler: setLastName,
			},
			{
				elementTestId: 'email',
				value: 'waldo.jeffers@guardian.co.uk',
				onChangeHandler: setEmail,
			},
			{
				elementTestId: 'confirm-email',
				value: 'waldo.jeffers@guardian.co.uk',
				onChangeHandler: setConfirmEmail,
			},
			{
				elementTestId: 'telephone',
				value: '02033532000',
				onChangeHandler: setTelephone,
			},
		];

		forEach(elementsToTest, ({ elementTestId, value, onChangeHandler }) => {
			it(`${elementTestId} onChange handler called`, () => {
				renderPersonalDetails(defaultProps);
				const element = screen.getByTestId(elementTestId);
				fireEvent.change(element, { target: { value } });
				expect(onChangeHandler).toHaveBeenCalledWith(value);
			});
		});
	});
});
