import { render, screen } from '@testing-library/react';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import * as subscriptionsModule from 'helpers/productPrice/subscriptions';
import { getPlans } from '../helpers/getPlans';
import NewspaperProductTabs from './NewspaperProductTabs';

jest.mock('../helpers/getPlans');
jest.mock('pages/aus-moment-map/hooks/useWindowWidth', () => ({
	useWindowWidth: () => ({ windowWidthIsGreaterThan: jest.fn() }),
}));
jest.mock(
	'pages/paper-subscription-landing/components/NewspaperRatePlanCard',
	() =>
		function () {
			return <div>Newspaper RatePlan Card</div>;
		},
);

describe('NewspaperProductTabs', () => {
	const productPrices = [{ someData: 'fooBar' }] as ProductPrices;
	beforeEach(() => {
		jest.clearAllMocks();
		(getPlans as jest.Mock).mockReturnValue([]);
	});

	it('should set the collect in store as the initial active tab', () => {
		render(<NewspaperProductTabs productPrices={productPrices} />);

		const tab = screen.getByRole('tab', { selected: true });

		expect(tab).toHaveTextContent('Collect in store');
	});

	it.each`
		fullfilmentOption | tabText
		${'HomeDelivery'} | ${'Home delivery'}
		${'Collection'}   | ${'Collect in store'}
	`(
		'should send a ophan event on tab click with the correct payload for $fullfilmentOption} ',
		({ fullfilmentOption, tabText }) => {
			// Arrange
			const sendTrackingSpy = jest.spyOn(
				subscriptionsModule,
				'sendTrackingEventsOnClick',
			);

			// Act
			render(<NewspaperProductTabs productPrices={productPrices} />);

			screen
				.getByRole('tab', {
					name: tabText as string,
				})
				.click();

			// Assert
			expect(sendTrackingSpy).toHaveBeenCalledWith({
				componentType: 'ACQUISITIONS_BUTTON',
				id: `Paper_${fullfilmentOption}-tab`,
				product: 'Paper',
			});
		},
	);
});
