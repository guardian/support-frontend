import { render, screen } from '@testing-library/react';
import { type LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import { StudentLandingPageUTS } from './StudentLandingPageUTS';

const auStudentDiscount = {
	amount: 0,
	periodNoun: 'month',
	discountPriceWithCurrency: '$0',
	fullPriceWithCurrency: '$20',
	promoCode: 'UTS_STUDENT',
	promoDuration: 'two years',
	discountSummary: '$0/month for two years, then $20/month',
};

describe('<StudentLandingPageUTS />', () => {
	const geoId: GeoId = 'au';
	const productKey: ActiveProductKey = 'SupporterPlus';
	const ratePlanKey: ActiveRatePlanKey = 'Monthly';
	const landingPageVariant = {
		products: {
			SupporterPlus: {
				benefits: ['Benefit 1', 'Benefit 2'],
			},
		},
	} as unknown as LandingPageVariant;

	it('shows promo duration in the subheading when provided', () => {
		render(
			<StudentLandingPageUTS
				geoId={geoId}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				landingPageVariant={landingPageVariant}
				studentDiscount={auStudentDiscount}
			/>,
		);
		expect(
			screen.getByText(`for ${auStudentDiscount.promoDuration}`),
		).toBeInTheDocument();
	});
});
