import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { render, screen } from '@testing-library/react';
import { StudentLandingPage } from './StudentLandingPage';

describe('StudentLandingPage', () => {
	it('should display country switcher for global student page in UK with Student Beans Europe disabled', () => {
		render(
			<StudentLandingPage
				supportRegionId={SupportRegionId.UK}
				header={<div>My header</div>}
				enableStudentBeansEurope={false}
			/>,
		);
		const countrySwitcherButton = screen.getByLabelText('Select a country');
		expect(countrySwitcherButton).toBeInTheDocument();
	});

	it('should display country switcher for global student page in UK with Student Beans Europe enabled', () => {
		render(
			<StudentLandingPage
				supportRegionId={SupportRegionId.UK}
				header={<div>My header</div>}
				enableStudentBeansEurope={true}
			/>,
		);
		const countrySwitcherButton = screen.getByLabelText('Select a country');
		expect(countrySwitcherButton).toBeInTheDocument();
	});

	it('should not display country switcher for global student page in EU', () => {
		render(
			<StudentLandingPage
				supportRegionId={SupportRegionId.EU}
				header={<div>My header</div>}
				enableStudentBeansEurope={true}
			/>,
		);
		const countrySwitcherButton = screen.queryByLabelText('Select a country');
		expect(countrySwitcherButton).not.toBeInTheDocument();
	});

	it('should not display country switcher for australian student page', () => {
		render(
			<StudentLandingPage
				supportRegionId={SupportRegionId.AU}
				header={<div>My header</div>}
				enableStudentBeansEurope={true}
			/>,
		);
		const countrySwitcherButton = screen.queryByLabelText('Select a country');
		expect(countrySwitcherButton).not.toBeInTheDocument();
	});
});
