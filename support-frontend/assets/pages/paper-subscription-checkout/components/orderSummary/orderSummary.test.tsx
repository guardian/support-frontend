/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { paperProducts } from '__mocks__/productInfoMocks';
import GridImage from 'components/gridImage/gridImage';
import PaperOrderSummary from './orderSummary';

function findTextAcrossElements(searchText) {
	return (content, node) => {
		const hasText = (element) => element.textContent === searchText;

		const nodeHasText = hasText(node);
		const childrenDontHaveText = Array.from(node.children).every(
			(child) => !hasText(child),
		);
		return nodeHasText && childrenDontHaveText;
	};
}

function mockPaperCheckoutReducer(originalState) {
	return originalState;
}

function renderWithStore(
	component,
	{
		initialState,
		store = createStore(mockPaperCheckoutReducer, initialState),
		...renderOptions
	} = {},
) {
	function Wrapper({ children }) {
		return <Provider store={store}>{children}</Provider>;
	}

	return render(component, {
		wrapper: Wrapper,
		...renderOptions,
	});
}

describe('Paper order summary', () => {
	// Suppress warnings related to our version of Redux
	console.warn = jest.fn();
	const productOption = 'EverydayPlus';
	let props;
	let initialState;
	beforeEach(() => {
		initialState = {
			page: {
				checkout: {
					product: 'Paper',
					billingPeriod: 'Monthly',
					productOption,
					fulfilmentOption: 'Collection',
					productPrices: paperProducts,
				},
			},
			common: {
				settings: {
					useDigitalVoucher: true,
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
			total:
				paperProducts['United Kingdom'].Collection[productOption].Monthly.GBP,
			includesDigiSub: true,
			digiSubPrice: '£5 per month',
			changeSubscription: '/page',
		};
		renderWithStore(<PaperOrderSummary {...props} />, {
			initialState,
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
			paperProducts['United Kingdom'].Collection[
				productOption.replace('Plus', '')
			].Monthly.GBP.price;
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
