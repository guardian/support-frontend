import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { render, screen } from '@testing-library/react';
import { type LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { StudentLandingPageInstitution } from './StudentLandingPageInstitution';

const testStudentDiscount = {
	amount: 0,
	periodNoun: 'month',
	discountPriceWithCurrency: '$0',
	fullPriceWithCurrency: '$20',
	promoCode: 'UTS_STUDENT',
	promoDuration: 'two years',
	discountSummary: '$0/month for two years, then $20/month',
};

const testStudentLandingPageVariant = {
	name: 'offer',
	heading: 'Heading',
	subheading: 'Subheading',
	image: {
		// TODO: complete this!
		desktopUrl: "",
		tabletUrl: "",
		mobileUrl: "",
		altText: ""
	},
	institution: {
		// TODO: complete this!
		name: "",
		acronym: "",
		logoUrl: ""
	},
	promoCode: ['UTS_STUDENT'],
};

describe('<StudentLandingPageInstitution />', () => {
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
			<StudentLandingPageInstitution
				landingPageVariant={landingPageVariant}
				studentLandingPageVariant={testStudentLandingPageVariant}
				supportRegionId={supportRegionId}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				studentDiscount={testStudentDiscount}
			/>,
		);
		expect(
			screen.getByText(`for ${testStudentDiscount.promoDuration}`),
		).toBeInTheDocument();
	});
});
