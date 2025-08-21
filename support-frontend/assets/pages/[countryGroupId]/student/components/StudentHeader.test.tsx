import { render, screen } from '@testing-library/react';
import { type LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import StudentHeader from './StudentHeader';

jest.mock('../helpers/discountDetails');
jest.mock('../helpers/buildCheckoutUrl');

jest.mock('components/gridPicture/gridPicture', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-testid="grid-picture">Grid Images</div>),
}));

export const oneYearStudentDiscount = {
	amount: 9,
	periodNoun: 'year',
	discountPriceWithCurrency: '£9',
	fullPriceWithCurrency: '£120',
};
export const auStudentDiscount = {
	amount: 0,
	periodNoun: 'month',
	discountPriceWithCurrency: '$0',
	fullPriceWithCurrency: '$20',
	promoCode: 'UTS_STUDENT',
	promoDuration: 'two years',
	discountSummary: '$0/month for two years, then $20/month',
};

describe('<StudentHeader />', () => {
	const geoId: GeoId = 'us';
	const productKey: ActiveProductKey = 'SupporterPlus';
	const ratePlanKey: ActiveRatePlanKey = 'Monthly';
	const landingPageVariant = {
		products: {
			SupporterPlus: {
				benefits: ['Benefit 1', 'Benefit 2'],
			},
		},
	} as unknown as LandingPageVariant;

	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('shows promo duration in the subheading when provided', () => {
		render(
			<StudentHeader
				geoId={geoId}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				landingPageVariant={landingPageVariant}
				studentDiscount={auStudentDiscount}
				headingCopy="Subscribe to fearless, independent and inspiring journalism"
			/>,
		);
		expect(
			screen.getByText(`for ${auStudentDiscount.promoDuration}`),
		).toBeInTheDocument();
	});

	it("uses 'Sign up for free' as CTA label when amount is 0", () => {
		render(
			<StudentHeader
				geoId={geoId}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				landingPageVariant={landingPageVariant}
				studentDiscount={auStudentDiscount}
				headingCopy="Subscribe to fearless, independent and inspiring journalism"
			/>,
		);
		expect(screen.getByTestId('cta-button')).toHaveTextContent(
			'Sign up for free',
		);
	});

	it("uses 'Subscribe' as CTA label when amount is greater than 0", () => {
		render(
			<StudentHeader
				geoId={geoId}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				landingPageVariant={landingPageVariant}
				studentDiscount={oneYearStudentDiscount}
				headingCopy="Subscribe to fearless, independent and inspiring journalism"
			/>,
		);
		expect(screen.getByTestId('cta-button')).toHaveTextContent('Subscribe');
	});

	it('passes discountSummary through to StudentProductCard', () => {
		render(
			<StudentHeader
				geoId={geoId}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				landingPageVariant={landingPageVariant}
				studentDiscount={auStudentDiscount}
				headingCopy="Subscribe to fearless, independent and inspiring journalism"
			/>,
		);
		expect(
			screen.getByText(auStudentDiscount.discountSummary),
		).toBeInTheDocument();
	});
});
