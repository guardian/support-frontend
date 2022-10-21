import { fireEvent, screen } from '@testing-library/react';
import { mockSettings } from '__mocks__/settingsMock';
import { renderWithStore } from '__test-utils__/render';
import { createTestStoreForContributions } from '__test-utils__/testStore';
import { toHumanReadableContributionType } from 'helpers/forms/checkouts';
import { PaymentFrequencyTabsContainer } from './paymentFrequencyTabsContainer';
import { PaymentFrequencyTabs } from './paymentFrequenncyTabs';

const contributionTypes = mockSettings.contributionTypes.GBPCountries;
const contribTypeNames = contributionTypes.map(
	({ contributionType }) => contributionType,
);
const defaultContribType = contributionTypes.find(
	(contribType) => contribType.isDefault,
);
const firstNonDefaultContribType = contributionTypes.find(
	(contribType) => !contribType.isDefault,
);

describe('Payment frequency tabs', () => {
	const ariaLabel = 'Payment tabs for test';
	let store: ReturnType<typeof createTestStoreForContributions>;

	beforeEach(() => {
		store = createTestStoreForContributions();

		renderWithStore(
			<PaymentFrequencyTabsContainer
				ariaLabel={ariaLabel}
				render={(tabProps) => (
					<PaymentFrequencyTabs
						{...tabProps}
						renderTabContent={(tabId) => `Content for ${tabId}`}
					/>
				)}
			/>,
			{
				store,
			},
		);
	});

	describe('The tab component', () => {
		it('has an accessible tab list', () => {
			const tabGroup = screen.getByRole('tablist');
			expect(tabGroup).toHaveAccessibleName(ariaLabel);
		});

		it('has correctly labelled tab controls', () => {
			contribTypeNames.forEach((name) => {
				const tab = screen.getByText(toHumanReadableContributionType(name));

				expect(tab).toHaveAttribute('role', 'tab');
			});
		});

		it('has a correctly labelled tab panel', () => {
			const panel = screen.getByRole('tabpanel');

			expect(panel).toHaveAttribute(
				'aria-labelledby',
				defaultContribType?.contributionType ?? '',
			);
		});
	});

	describe('Switching tabs', () => {
		it('changes the visible content in the tab panel', () => {
			const firstNonDefaultName =
				firstNonDefaultContribType?.contributionType ?? 'ONE_OFF';
			const firstUnselectedTab = screen.getByText(
				toHumanReadableContributionType(firstNonDefaultName),
			);
			fireEvent.click(firstUnselectedTab);

			expect(
				screen.getByText(`Content for ${firstNonDefaultName}`),
			).toBeInTheDocument();
		});

		it('automatically focuses on the selected tab panel', () => {
			const firstNonDefaultName =
				firstNonDefaultContribType?.contributionType ?? 'ONE_OFF';
			const firstUnselectedTab = screen.getByText(
				toHumanReadableContributionType(firstNonDefaultName),
			);
			fireEvent.click(firstUnselectedTab);

			expect(screen.getByRole('tabpanel')).toHaveFocus();
		});
	});
});
