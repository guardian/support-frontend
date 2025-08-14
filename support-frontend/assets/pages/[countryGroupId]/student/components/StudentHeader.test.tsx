import { render, screen } from '@testing-library/react';
import { type LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import { getStudentDiscount } from '../helpers/discountDetails';
import StudentHeader from './StudentHeader';

jest.mock('../helpers/discountDetails');
jest.mock('../helpers/buildCheckoutUrl');

jest.mock('components/gridPicture/gridPicture', () => ({
	__esModule: true,
	default: jest.fn(() => <div data-testid="grid-picture">Grid Images</div>),
}));

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
		(getStudentDiscount as jest.Mock).mockReturnValue({
			amount: 10,
			promoDuration: '3 months',
			promoCode: undefined,
			discountSummary: undefined,
		});

		render(
			<StudentHeader
				geoId={geoId}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				landingPageVariant={landingPageVariant}
			/>,
		);

		expect(screen.getByText('free for 3 months')).toBeInTheDocument();
	});

	it("uses 'Sign up for free' as CTA label when amount is 0", () => {
		(getStudentDiscount as jest.Mock).mockReturnValue({
			amount: 0,
			promoDuration: undefined,
			promoCode: undefined,
			discountSummary: undefined,
		});

		render(
			<StudentHeader
				geoId={geoId}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				landingPageVariant={landingPageVariant}
			/>,
		);

		expect(screen.getByTestId('cta-button')).toHaveTextContent(
			'Sign up for free',
		);
	});

	it("uses 'Subscribe' as CTA label when amount is 0", () => {
		(getStudentDiscount as jest.Mock).mockReturnValue({
			amount: 10,
			promoDuration: undefined,
			promoCode: undefined,
			discountSummary: undefined,
		});

		render(
			<StudentHeader
				geoId={geoId}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				landingPageVariant={landingPageVariant}
			/>,
		);

		expect(screen.getByTestId('cta-button')).toHaveTextContent('Subscribe');
	});

	it('passes discountSummary through to StudentProductCard', () => {
		(getStudentDiscount as jest.Mock).mockReturnValue({
			amount: 5,
			discountSummary: '50% off for 3 months',
		});

		render(
			<StudentHeader
				geoId={geoId}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				landingPageVariant={landingPageVariant}
			/>,
		);

		expect(screen.getByText('50% off for 3 months')).toBeInTheDocument();
	});
});
