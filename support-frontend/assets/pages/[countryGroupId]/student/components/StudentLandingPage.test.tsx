import { render, screen } from '@testing-library/react';
import { StudentLandingPage } from './StudentLandingPage';

describe('StudentLandingPage', () => {
	it('should display country switcher for global student page', () => {
		render(<StudentLandingPage geoId="uk" header={<div>My header</div>} />);
		const countrySwitcherhButton = screen.getByLabelText('Select a country');
		expect(countrySwitcherhButton).toBeInTheDocument();
	});

	it('should not display country switcher for australian student page', () => {
		render(<StudentLandingPage geoId="au" header={<div>My header</div>} />);
		const countrySwitcherhButton = screen.queryByLabelText('Select a country');
		expect(countrySwitcherhButton).not.toBeInTheDocument();
	});
});
