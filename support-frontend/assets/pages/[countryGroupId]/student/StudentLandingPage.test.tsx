import { render, screen } from '@testing-library/react';
import { getLandingPageParticipations } from 'helpers/abTests/landingPageAbTests';
import {
	auStudentDiscount,
	oneYearStudentDiscount,
} from './components/StudentHeader.test';
import { StudentLandingPage } from './StudentLandingPage';

describe('StudentLandingPage', () => {
	const landingPageParticipations = getLandingPageParticipations();

	it('should display country switcher for global student page', () => {
		render(
			<StudentLandingPage
				geoId="uk"
				productKey="SupporterPlus"
				ratePlanKey="OneYearStudent"
				landingPageVariant={landingPageParticipations.variant}
				studentDiscount={oneYearStudentDiscount}
			/>,
		);
		const countrySwitcherhButton = screen.getByLabelText('Select a country');
		expect(countrySwitcherhButton).toBeInTheDocument();
	});

	it('should not display country switcher for australian student page', () => {
		render(
			<StudentLandingPage
				geoId="au"
				productKey="SupporterPlus"
				ratePlanKey="Monthly"
				landingPageVariant={landingPageParticipations.variant}
				studentDiscount={auStudentDiscount}
			/>,
		);
		const countrySwitcherhButton = screen.queryByLabelText('Select a country');
		expect(countrySwitcherhButton).not.toBeInTheDocument();
	});
});
