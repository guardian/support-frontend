import { render, screen } from '@testing-library/react';
import { isObserverSubdomain } from 'helpers/globalsAndSwitches/observer';
import { observerLinks, preContractLinks } from 'helpers/legal';
import PreContractLink, {
	getPreContractLinkByProduct,
} from './preContractLink';

jest.mock('helpers/globalsAndSwitches/observer', () => ({
	isObserverSubdomain: jest.fn(() => false),
}));

const mockIsObserverSubdomain = jest.mocked(isObserverSubdomain);

describe('getPreContractLinkByProduct', () => {
	it.each([
		['SupporterPlus', preContractLinks.ALL_ACCESS_DIGITAL],
		['DigitalSubscription', preContractLinks.DIGITAL_PLUS],
		['GuardianAdLite', preContractLinks.GUARDIAN_AD_LITE],
		['HomeDelivery', preContractLinks.NEWSPAPER],
		['NationalDelivery', preContractLinks.NEWSPAPER],
		['SubscriptionCard', preContractLinks.NEWSPAPER],
		['GuardianWeeklyDomestic', preContractLinks.GUARDIAN_WEEKLY],
		['GuardianWeeklyRestOfWorld', undefined],
		['Contribution', undefined],
		['OneTimeContribution', undefined],
	] as const)('returns the pre-contract link for %s', (productKey, link) => {
		expect(getPreContractLinkByProduct(productKey, false)).toBe(link);
	});

	it.each(['SubscriptionCard', 'HomeDelivery'] as const)(
		'returns the Observer pre-contract link for %s when isObserver is true',
		(productKey) => {
			expect(getPreContractLinkByProduct(productKey, true)).toBe(
				observerLinks.PRE_CONTRACT,
			);
		},
	);
});

describe('PreContractLink', () => {
	beforeEach(() => mockIsObserverSubdomain.mockReturnValue(false));

	it('renders the product pre-contract link', () => {
		const { container } = render(
			<PreContractLink
				productKey="GuardianWeeklyDomestic"
				ratePlanKey="MonthlyPlus"
			/>,
		);
		expect(container.textContent).toBe(
			'For more important information about your subscription click here.',
		);
		expect(screen.getByRole('link', { name: 'here' })).toHaveAttribute(
			'href',
			preContractLinks.GUARDIAN_WEEKLY,
		);
	});

	it('renders the Observer wording and link on the Observer subdomain', () => {
		mockIsObserverSubdomain.mockReturnValue(true);
		const { container } = render(
			<PreContractLink productKey="SubscriptionCard" ratePlanKey="Sunday" />,
		);
		expect(container.textContent).toBe(
			'See more details about your subscription in your full pre-contract information here.',
		);
		expect(screen.getByRole('link', { name: 'here' })).toHaveAttribute(
			'href',
			observerLinks.PRE_CONTRACT,
		);
	});

	it('renders nothing when the product has no pre-contract link', () => {
		const { container } = render(
			<PreContractLink productKey="Contribution" ratePlanKey="Monthly" />,
		);
		expect(container).toBeEmptyDOMElement();
	});
});
