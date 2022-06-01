import { fireEvent, render, screen } from '@testing-library/react';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import PersonalDetails from './personalDetails';

describe('Personal Details', () => {
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
		isSignedIn: false,
		formErrors: [],
	};

	const renderPersonalDetails = ({
		firstName,
		lastName,
		email,
		confirmEmail,
		isSignedIn,
		formErrors,
	}: {
		firstName: string;
		lastName: string;
		email: string;
		confirmEmail: string;
		isSignedIn: boolean;
		formErrors: Array<FormError<FormField>>;
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

	it('does render confirm email when isSignedIn false', () => {
		renderPersonalDetails(defaultProps);

		const element = screen.queryByTestId('confirm-email');
		expect(element).toBeInTheDocument();
	});

	it('does not render confirm email when isSignedIn true', () => {
		renderPersonalDetails({
			...defaultProps,
			isSignedIn: true,
		});

		const element = screen.queryByTestId('confirm-email');
		expect(element).not.toBeInTheDocument();
	});

	it('does not render SignedInEmailFooter if isSignedIn false', () => {
		renderPersonalDetails(defaultProps);

		const element = screen.queryByTestId('sign-out');
		expect(element).not.toBeInTheDocument();
	});

	it('does render SignedInEmailFooter if isSignedIn true', () => {
		renderPersonalDetails({
			...defaultProps,
			isSignedIn: true,
		});

		const element = screen.queryByTestId('sign-out');
		expect(element).toBeInTheDocument();
	});

	it('handleSignOut on Sign out button click', () => {
		renderPersonalDetails({
			...defaultProps,
			isSignedIn: true,
		});

		const element = screen.getByTestId('sign-out');
		fireEvent.click(element);
		expect(signOut).toHaveBeenCalled();
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

		elementsToTest.forEach(({ elementTestId, value, onChangeHandler }) => {
			it(`${elementTestId} onChange handler called`, () => {
				renderPersonalDetails(defaultProps);
				const element = screen.getByTestId(elementTestId);
				fireEvent.change(element, { target: { value } });
				expect(onChangeHandler).toHaveBeenCalledWith(value);
			});
		});
	});

	describe('Error messages', () => {
		const formErrors: Array<FormError<FormField>> = [
			{
				field: 'firstName',
				message: 'Please enter a first name.',
			},
			{
				field: 'lastName',
				message: 'Please enter a last name.',
			},
			{
				field: 'email',
				message: 'Please enter a valid email address.',
			},
		];

		it('does not show error messages when no formErrors in props', () => {
			renderPersonalDetails(defaultProps);

			formErrors.forEach(({ message }) => {
				const element = screen.queryByText(message);
				expect(element).not.toBeInTheDocument();
			});
		});

		it('shows error messages when formErrors in props', () => {
			renderPersonalDetails({
				...defaultProps,
				formErrors,
			});

			formErrors.forEach(({ message }) => {
				const element = screen.queryByText(message);
				expect(element).toBeInTheDocument();
			});
		});
	});
});
