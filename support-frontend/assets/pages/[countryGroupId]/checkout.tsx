import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import { Column, Columns, Container } from '@guardian/source-react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-react-components-development-kitchen';
import { useEffect, useState } from 'react';
import {
	number,
	object,
	type Output,
	parse,
	picklist,
	record,
	string,
} from 'valibot'; // 1.54 kB
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import { PageScaffold } from 'components/page/pageScaffold';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import type { Currency } from 'helpers/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';
import { renderPage } from 'helpers/rendering/render';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { GuardianTsAndCs } from 'pages/supporter-plus-landing/components/guardianTsAndCs';

const darkBackgroundContainerMobile = css`
	background-color: ${palette.neutral[97]};
	${until.tablet} {
		background-color: ${palette.brand[400]};
		border-bottom: 1px solid ${palette.brand[600]};
	}
`;

const columns = css`
	position: relative;
	color: ${palette.neutral[7]};
	${textSans.medium()};
	padding-top: ${space[2]}px;
`;

const secureTransactionIndicator = css`
	margin-bottom: ${space[3]}px;
	${from.tablet} {
		margin-bottom: ${space[4]}px;
	}
`;

const shorterBoxMargin = css`
	:not(:last-child) {
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	}
`;

const searchParams = new URLSearchParams(window.location.search);
const query = {
	productId: searchParams.get('product'),
	ratePlanId: searchParams.get('ratePlan'),
};

const countryGroupIds = ['uk', 'us', 'eu', 'au', 'nz', 'ca', 'int'] as const;
const CountryGroupIdSchema = picklist(countryGroupIds);
const countryGroupId = parse(
	CountryGroupIdSchema,
	window.location.pathname.split('/')[1],
);

let currentCurrency: Currency;
let currentCurrencyKey: keyof typeof currencies;
switch (countryGroupId) {
	case 'uk':
		currentCurrency = currencies.GBP;
		currentCurrencyKey = 'GBP';
		break;
	case 'us':
		currentCurrency = currencies.USD;
		currentCurrencyKey = 'USD';
		break;
	case 'au':
		currentCurrency = currencies.AUD;
		currentCurrencyKey = 'AUD';
		break;
	case 'eu':
		currentCurrency = currencies.EUR;
		currentCurrencyKey = 'EUR';
		break;
	case 'nz':
		currentCurrency = currencies.NZD;
		currentCurrencyKey = 'NZD';
		break;
	case 'ca':
		currentCurrency = currencies.CAD;
		currentCurrencyKey = 'CAD';
		break;
}

const ProductSchema = object({
	ratePlans: record(
		object({
			id: string(),
			pricing: record(number()),
			charges: record(
				object({
					id: string(),
				}),
			),
		}),
	),
});

const ProductsSchema = object({
	products: record(ProductSchema),
});
type Products = Output<typeof ProductsSchema>;

function describeProduct(productId: string, ratePlanId: string) {
	let description = `${productId} - ${ratePlanId}`;
	let frequency = '';

	if (productId === 'HomeDelivery') {
		frequency = 'month';
		description = `${ratePlanId} paper`;

		if (ratePlanId === 'Sixday') {
			description = 'Six day paper';
		}
		if (ratePlanId === 'Everyday') {
			description = 'Every day paper';
		}
		if (ratePlanId === 'Weekend') {
			description = 'Weekend paper';
		}
		if (ratePlanId === 'Saturday') {
			description = 'Saturday paper';
		}
		if (ratePlanId === 'Sunday') {
			description = 'Sunday paper';
		}
	}

	if (
		productId === 'GuardianWeeklyDomestic' ||
		productId === 'GuardianWeeklyRestOfWorld'
	) {
		if (ratePlanId === 'OneYearGift') {
			frequency = 'year';
			description = 'The Guardian Weekly Gift Subscription';
		}
		if (ratePlanId === 'Annual') {
			frequency = 'year';
			description = 'The Guardian Weekly';
		}
		if (ratePlanId === 'Quarterly') {
			frequency = 'quarter';
			description = 'The Guardian Weekly';
		}
		if (ratePlanId === 'Monthly') {
			frequency = 'month';
			description = 'The Guardian Weekly';
		}
		if (ratePlanId === 'ThreeMonthGift') {
			frequency = 'quarter';
			description = 'The Guardian Weekly Gift Subscription';
		}
		if (ratePlanId === 'SixWeekly') {
			frequency = 'month';
			description = 'The Guardian Weekly';
		}
	}

	return { description, frequency };
}

export function Checkout() {
	const [products, setProducts] = useState<Products>();

	useEffect(() => {
		void fetch('/api/products')
			.then((resp) => resp.json())
			.then((data) => {
				const vData = parse(ProductsSchema, data);
				setProducts(vData);
			});
	}, []);

	if (!query.productId || !query.ratePlanId) {
		return <div>Not enough query parameters</div>;
	}

	const currentProduct = products?.products[query.productId];
	const currentRatePlan = currentProduct?.ratePlans[query.ratePlanId];
	const currentPrice = currentRatePlan?.pricing[currentCurrencyKey] ?? 0;

	if (!currentProduct) {
		return <div>Product not found</div>;
	}

	return (
		<PageScaffold
			header={<Header></Header>}
			footer={
				<FooterWithContents>
					<FooterLinks></FooterLinks>
				</FooterWithContents>
			}
		>
			<CheckoutHeading withTopBorder={true}></CheckoutHeading>
			<Container sideBorders cssOverrides={darkBackgroundContainerMobile}>
				<Columns cssOverrides={columns} collapseUntil="tablet">
					<Column span={[0, 2, 5]}></Column>
					<Column span={[1, 8, 7]}>
						<SecureTransactionIndicator
							align="center"
							theme="light"
							cssOverrides={secureTransactionIndicator}
						/>
						<Box cssOverrides={shorterBoxMargin}>
							<BoxContents>
								<ContributionsOrderSummary
									contributionType={'MONTHLY'}
									total={currentPrice}
									currency={currentCurrency}
									checkListData={[]}
									onAccordionClick={(isOpen) => {
										trackComponentClick(
											`contribution-order-summary-${
												isOpen ? 'opened' : 'closed'
											}`,
										);
									}}
									productDescription={describeProduct(
										query.productId,
										query.ratePlanId,
									)}
									tsAndCs={null}
								/>
							</BoxContents>
						</Box>
						<GuardianTsAndCs
							mobileTheme={'light'}
							displayPatronsCheckout={false}
						/>
					</Column>
				</Columns>
			</Container>
		</PageScaffold>
	);
}

export default renderPage(<Checkout />);
