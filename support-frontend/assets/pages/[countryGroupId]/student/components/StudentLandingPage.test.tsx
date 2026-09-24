import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { render, screen } from '@testing-library/react';
import { StudentLandingPage } from './StudentLandingPage';

describe('StudentLandingPage', () => {
	it('should not display country switcher for global student page in UK', () => {
		render(
			<StudentLandingPage
				supportRegionId={SupportRegionId.UK}
				header={<div>My header</div>}
			/>,
		);
		const countrySwitcherButton = screen.queryByLabelText('Select a country');
		expect(countrySwitcherButton).not.toBeInTheDocument();
	});

	it('should not display country switcher for global student page in EU', () => {
		render(
			<StudentLandingPage
				supportRegionId={SupportRegionId.EU}
				header={<div>My header</div>}
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
			/>,
		);
		const countrySwitcherButton = screen.queryByLabelText('Select a country');
		expect(countrySwitcherButton).not.toBeInTheDocument();
	});
});
