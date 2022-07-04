import { screen } from '@testing-library/react';
import { paperProducts } from '__mocks__/productInfoMocks';
import { renderWithStore } from '__test-utils__/render';
import GridImage from 'components/gridImage/gridImage';
import type { OrderSummaryProps } from './orderSummary';
import PaperOrderSummary from './orderSummary';

function findTextAcrossElements(searchText: string) {
	return (_: unknown, node: Element | null) => {
		const hasText = (element: Element | null) =>
			element?.textContent === searchText;

		const nodeHasText = hasText(node);
		const childrenDontHaveText = Array.from(node?.children ?? []).every(
			(child) => !hasText(child),
		);
		return nodeHasText && childrenDontHaveText;
	};
}

function mockPaperCheckoutReducer<StateType>(originalState: StateType) {
	return originalState;
}

describe('Paper order summary', () => {
	// Suppress warnings related to our version of Redux
	console.warn = jest.fn();
	const productOption = 'EverydayPlus';
	let props: OrderSummaryProps;
	let initialState;
	beforeEach(() => {
		initialState = {
			page: {
				checkoutForm: {
					product: {
						productType: 'Paper',
						billingPeriod: 'Monthly',
						productOption,
						fulfilmentOption: 'Collection',
						productPrices: paperProducts,
					},
				},
			},
			common: {
				settings: {
					useDigitalVoucher: true,
				},
				internationalisation: {
					countryID: 'GB',
				},
			},
		};
		props = {
			image: (
				<GridImage
					gridId="printCampaignHDdigitalVoucher"
					srcSizes={[500]}
					sizes="(max-width: 740px) 50vw, 696"
					imgType="png"
					altText=""
				/>
			),
			total: paperProducts['United Kingdom']?.Collection?.EverydayPlus?.Monthly
				?.GBP ?? {
				price: 29.2,
				savingVsRetail: 41,
				currency: 'GBP',
				fixedTerm: false,
				promotions: [],
			},
			includesDigiSub: true,
			digiSubPrice: '£5 per month',
			changeSubscription: '/page',
		};
		renderWithStore(<PaperOrderSummary {...props} />, {
			initialState,
			reducer: mockPaperCheckoutReducer,
		});
	});

	it('contains a link to return to the relevant product page', async () => {
		expect(await screen.findByText('Change')).toHaveAttribute('href', '/page');
	});

	it('displays a second product when the digital subscription is included', async () => {
		expect(await screen.findByText('Digital subscription')).toBeInTheDocument();
	});

	it('displays the correct total price', async () => {
		const mockPrice = props.total.price.toFixed(2);
		expect(
			await screen.findByText(
				findTextAcrossElements(`Total:£${mockPrice} per month`),
			),
		).toBeInTheDocument();
	});

	it('displays the correct short summary for mobile', async () => {
		expect(
			await screen.findByText('Every day subscription card + digital'),
		).toBeInTheDocument();
	});

	it('displays the correct price for the standalone paper product', async () => {
		const paperOnlyPrice =
			paperProducts['United Kingdom']?.Collection?.Everyday?.Monthly?.GBP
				?.price ?? 0;
		expect(
			await screen.findByText(`You'll pay £${paperOnlyPrice} per month`),
		).toBeInTheDocument();
	});

	it('displays the separate price for the digital subscription', async () => {
		expect(
			await screen.findByText("You'll pay £5 per month"),
		).toBeInTheDocument();
	});
});
