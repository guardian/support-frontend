import { render, screen } from '@testing-library/react';
import { type LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import { StudentLandingPageGlobal } from './StudentLandingPageGlobal';

const oneYearStudentDiscount = {
	amount: 9,
	periodNoun: 'year',
	discountPriceWithCurrency: '£9',
	fullPriceWithCurrency: '£120',
};

describe('<StudentLandingPageGlobal />', () => {
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

	it("uses 'Subscribe' as CTA label when amount is greater than 0", () => {
		render(
			<StudentLandingPageGlobal
				geoId={geoId}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				landingPageVariant={landingPageVariant}
				studentDiscount={oneYearStudentDiscount}
			/>,
		);
		expect(screen.getByTestId('cta-button')).toHaveTextContent('Subscribe');
	});
});
