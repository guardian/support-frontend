// import { render, screen } from '@testing-library/react';
// import { getLandingPageParticipations } from 'helpers/abTests/landingPageAbTests';
// import { StudentLandingPage } from './StudentLandingPage';
// import { getStudentDiscount } from './helpers/discountDetails';
// import { getPromotion } from 'helpers/productPrice/promotions';

jest.mock('helpers/productPrice/promotions');
jest.mock('./helpers/discountDetails');

describe('StudentLandingPage', () => {
	// const landingPageParticipations = getLandingPageParticipations();

	it('should display country switcher for global student page', () => {
		// 	(getPromotion as jest.Mock).mockReturnValue(undefined);
		// 	(getStudentDiscount as jest.Mock).mockReturnValue({
		// 		amount: 9,
		// 		periodNoun: 'month',
		// 		discountPriceWithCurrency: '£9',
		// 		fullPriceWithCurrency: '£120',
		// 	});
		// 	render(
		// 		<StudentLandingPage
		// 			geoId="uk"
		// 			productKey="SupporterPlus"
		// 			ratePlanKey="OneYearStudent"
		// 			landingPageVariant={landingPageParticipations.variant}
		// 		/>,
		// 	);
		// 	const countrySwitcherhButton = screen.getByLabelText('Select a country');
		// 	expect(countrySwitcherhButton).toBeInTheDocument();
	});

	it('should not display country switcher for australian student page', () => {
		// (getPromotion as jest.Mock).mockReturnValue({
		// 	name: 'AU_STUDENT_100',
		// 	description: '100% discount for Australian students',
		// 	promoCode: 'UTS_STUDENT',
		// 	discount: { amount: 100, durationMonths: 24 },
		// 	discountedPrice: 0,
		// 	numberOfDiscountedPeriods: 24,
		// });
		// (getStudentDiscount as jest.Mock).mockReturnValue({
		// 	amount: 0,
		// 	periodNoun: 'month',
		// 	discountPriceWithCurrency: '$0',
		// 	fullPriceWithCurrency: '$20',
		// 	promoCode: 'UTS_STUDENT',
		// 	promoDuration: 'two years',
		// 	discountSummary: '$0/month for two years, then $20/month',
		// });
		// render(
		// 	<StudentLandingPage
		// 		geoId="au"
		// 		productKey="SupporterPlus"
		// 		ratePlanKey="Monthly"
		// 		landingPageVariant={landingPageParticipations.variant}
		// 	/>,
		// );
		// const countrySwitcherhButton = screen.queryByLabelText('Select a country');
		// expect(countrySwitcherhButton).not.toBeInTheDocument();
	});
});
