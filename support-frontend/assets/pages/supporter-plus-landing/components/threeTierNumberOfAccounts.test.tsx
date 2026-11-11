import { render, screen } from '@testing-library/react';
import { defaultCardTheme } from 'helpers/landingPage/cardTheme';
import { ThreeTierNumberOfAccounts } from './threeTierNumberOfAccounts';

describe('threeTierAccount', () => {
	it('Digital Subscription renders correctly', () => {
		render(
			<ThreeTierNumberOfAccounts
				productKey={'DigitalSubscription'}
				cardTheme={defaultCardTheme}
			/>,
		);
		expect(screen.getByText('3 extra accounts to share')).toBeInTheDocument();
	});
	it('SupporterPlus Subscription renders an empty container', () => {
		const { container } = render(
			<ThreeTierNumberOfAccounts
				productKey={'SupporterPlus'}
				cardTheme={defaultCardTheme}
			/>,
		);
		expect(container.querySelector('section')).toBeInTheDocument();
		expect(container.textContent).toBe('');
	});
	it('Contribution Subscription renders an empty container', () => {
		const { container } = render(
			<ThreeTierNumberOfAccounts
				productKey={'Contribution'}
				cardTheme={defaultCardTheme}
			/>,
		);
		expect(container.querySelector('section')).toBeInTheDocument();
		expect(container.textContent).toBe('');
	});
});
