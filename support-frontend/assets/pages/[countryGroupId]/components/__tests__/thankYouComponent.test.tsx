import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
	ThankYouComponent,
	CheckoutComponentProps,
} from '../thankYouComponent';

jest.mock('../../checkout/helpers/sessionStorage', () => ({
	getThankYouOrder: () => 'order',
	getReturnAddress: () => 'adress',
}));

describe('thankYouComponent', () => {
	const defaultProps: CheckoutComponentProps = {
		geoId: 'uk',
		payment: {
			originalAmount: 12,
			finalAmount: 12,
		},
		identityUserType: 'new',
		abParticipations: {},
	};

	it('should dispaly the correct thankyou cards for One time contribution', () => {
		render(<ThankYouComponent {...defaultProps} />);

		const feedback = screen.getByTestId('feedback');
		const signUp = screen.getByTestId('signUp');
		const supportReminder = screen.getByTestId('supportReminder');
		const socialShare = screen.getByTestId('socialShare');

		expect(feedback).toBeInTheDocument();
		expect(signUp).toBeInTheDocument();
		expect(supportReminder).toBeInTheDocument();
		expect(socialShare).toBeInTheDocument();
	});

	it('should dispaly the correct thankyou cards for Recurring Contribution for new users', () => {
		render(
			<ThankYouComponent
				{...defaultProps}
				productKey="Contribution"
				ratePlanKey="Monthly"
			/>,
		);

		const signIn = screen.getByTestId('signUp');
		const socialShare = screen.getByTestId('socialShare');

		expect(signIn).toBeInTheDocument();
		expect(socialShare).toBeInTheDocument();
	});

	it('should dispaly the correct thankyou cards for Recurring Contribution for existing users', () => {
		render(
			<ThankYouComponent
				{...defaultProps}
				productKey="Contribution"
				ratePlanKey="Monthly"
				identityUserType="current"
			/>,
		);

		const signIn = screen.getByTestId('signIn');
		const socialShare = screen.getByTestId('socialShare');

		expect(signIn).toBeInTheDocument();
		expect(socialShare).toBeInTheDocument();
	});
});
