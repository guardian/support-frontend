import { BillingPeriod } from '@modules/product/billingPeriod';
import { render, screen } from '@testing-library/react';
import { PromoTermsProvider, usePromoTerms } from 'contexts/PromoTermsContext';
import type { TsAndCsProps } from './threeTierTsAndCs';
import { ThreeTierTsAndCs } from './threeTierTsAndCs';

function PromoTermsProbe() {
	const { promoTerms } = usePromoTerms();
	return (
		<ul>
			{promoTerms.map((terms) => (
				<li data-testid="promo-terms">{terms}</li>
			))}
		</ul>
	);
}

const renderTsAndCs = (tsAndCsContent: TsAndCsProps[]) => {
	const ui = (content: TsAndCsProps[]) => (
		<PromoTermsProvider>
			<ThreeTierTsAndCs tsAndCsContent={content} currency="£" />
			<PromoTermsProbe />
		</PromoTermsProvider>
	);
	const view = render(ui(tsAndCsContent));
	return {
		rerenderWith: (content: TsAndCsProps[]) => view.rerender(ui(content)),
	};
};

const getContextTerms = () =>
	screen.queryAllByTestId('promo-terms').map((item) => item.textContent);

const withoutPromotion = (title: string, price: number): TsAndCsProps => ({
	title,
	planCost: { price },
});

const withPromotion = (
	title: string,
	price: number,
	discountedPrice: number,
	dates?: Pick<TsAndCsProps, 'starts' | 'expires'>,
): TsAndCsProps => ({
	title,
	planCost: {
		price,
		discount: {
			percentage: 25,
			price: discountedPrice,
			duration: { value: 12, period: BillingPeriod.Monthly },
		},
	},
	...dates,
});

const offerTerms = (stars: string, title: string, summary: string) =>
	`${stars} ${title} offer is ${summary} afterwards unless you cancel. Offer only available to new subscribers who do not have an existing subscription with the Guardian.`;

describe('ThreeTierTsAndCs', () => {
	it('sets no promo terms when there are no promotions', () => {
		renderTsAndCs([
			withoutPromotion('Support', 5),
			withoutPromotion('All-access digital', 12),
			withoutPromotion('Digital plus', 18),
		]);

		expect(getContextTerms()).toEqual([]);
	});

	it('sets one terms entry per promotion, with a matching asterisk count', () => {
		renderTsAndCs([
			withoutPromotion('Support', 5),
			withPromotion('All-access digital', 12, 9),
			withPromotion('Digital plus', 18, 14),
		]);

		expect(getContextTerms()).toEqual([
			offerTerms(
				'*',
				'All-access digital',
				'£9/month for the first 12 months, then £12/month',
			),
			offerTerms(
				'**',
				'Digital plus',
				'£14/month for the first 12 months, then £18/month',
			),
		]);
	});

	it('renders the same terms that are set in the context', () => {
		renderTsAndCs([withPromotion('All-access digital', 12, 9)]);

		expect(
			screen.getByText(
				offerTerms(
					'*',
					'All-access digital',
					'£9/month for the first 12 months, then £12/month',
				),
				{ selector: 'p' },
			),
		).toBeInTheDocument();
	});

	it('includes the offer dates when the promotion has them', () => {
		renderTsAndCs([
			withPromotion('All-access digital', 12, 9, {
				starts: new Date(2024, 0, 1),
				expires: new Date(2024, 11, 31),
			}),
		]);

		const [terms] = getContextTerms();
		expect(terms).toContain('Offer starts on the');
		expect(terms).toContain('and ends on the');
	});

	it('replaces the terms in the context when the promotions change', () => {
		const { rerenderWith } = renderTsAndCs([
			withPromotion('All-access digital', 12, 9),
		]);
		expect(getContextTerms()).toHaveLength(1);

		rerenderWith([
			withPromotion('All-access digital', 12, 9),
			withPromotion('Digital plus', 18, 14),
		]);
		expect(getContextTerms()).toHaveLength(2);

		rerenderWith([withoutPromotion('All-access digital', 12)]);
		expect(getContextTerms()).toEqual([]);
	});
});
