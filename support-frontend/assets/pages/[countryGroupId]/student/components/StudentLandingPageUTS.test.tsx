import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { render, screen } from '@testing-library/react';
import { type LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { StudentLandingPageUTS } from './StudentLandingPageUTS';

const utsStudentDiscount = {
	amount: 0,
	periodNoun: 'month',
	discountPriceWithCurrency: '$0',
	fullPriceWithCurrency: '$20',
	promoCode: 'UTS_STUDENT',
	promoDuration: 'two years',
	discountSummary: '$0/month for two years, then $20/month',
};

describe('<StudentLandingPageUTS />', () => {
	const supportRegionId = SupportRegionId.AU;
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
				supportRegionId={supportRegionId}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				landingPageVariant={landingPageVariant}
				studentDiscount={utsStudentDiscount}
			/>,
		);
		expect(
			screen.getByText(`for ${utsStudentDiscount.promoDuration}`),
		).toBeInTheDocument();
	});
});
