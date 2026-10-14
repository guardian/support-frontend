import { render, screen } from '@testing-library/react';
import { defaultCardTheme } from 'helpers/landingPage/cardTheme';
import { ThreeTierAccount } from './threeTierAccount';

describe('threeTierAccount', () => {
	it('Digital Subscription renders v1 correctly', () => {
		render(
			<ThreeTierAccount
				productKey={'DigitalSubscription'}
				cardTheme={defaultCardTheme}
				multipleAccountsVariant={'v1'}
			/>,
		);
		expect(screen.getByText('3 extra accounts to share')).toBeInTheDocument();
	});
	it('Digital Subscription renders v2 correctly', () => {
		render(
			<ThreeTierAccount
				productKey={'DigitalSubscription'}
				cardTheme={defaultCardTheme}
				multipleAccountsVariant={'v2'}
			/>,
		);
		expect(screen.getByText('4 accounts')).toBeInTheDocument();
	});
	it('SupporterPlus Subscription v1 renders an empty container', () => {
		const { container } = render(
			<ThreeTierAccount
				productKey={'SupporterPlus'}
				cardTheme={defaultCardTheme}
				multipleAccountsVariant={'v1'}
			/>,
		);
		expect(container.querySelector('section')).toBeInTheDocument();
		expect(container.textContent).toBe('');
	});
	it('SupporterPlus Subscription v2 renders 1 account', () => {
		render(
			<ThreeTierAccount
				productKey={'SupporterPlus'}
				cardTheme={defaultCardTheme}
				multipleAccountsVariant={'v2'}
			/>,
		);
		expect(screen.getByText('1 account')).toBeInTheDocument();
	});
	it('Contribution Subscription renders an empty container', () => {
		const { container } = render(
			<ThreeTierAccount
				productKey={'Contribution'}
				cardTheme={defaultCardTheme}
				multipleAccountsVariant={'v1'}
			/>,
		);
		expect(container.querySelector('section')).toBeInTheDocument();
		expect(container.textContent).toBe('');
	});
	it('Undefined MultipleAccounts returns null', () => {
		const { container } = render(
			<ThreeTierAccount
				productKey={'Contribution'}
				cardTheme={defaultCardTheme}
				multipleAccountsVariant={undefined}
			/>,
		);
		expect(container).toBeEmptyDOMElement();
	});
});
