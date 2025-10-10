import { expect, userEvent, waitFor, within } from 'storybook/test';
import NavComponent from 'components/nav/nav';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';

export default {
	title: 'Checkout Layout/Nav',
	component: NavComponent,
	argTypes: {
		countryGroup: {
			type: 'select',
			options: [
				AUDCountries,
				Canada,
				EURCountries,
				GBPCountries,
				International,
				NZDCountries,
				UnitedStates,
			],
		},
	},
	decorators: [(Story: React.FC): JSX.Element => <Story />],
};

export function Nav(args: { countryGroup: CountryGroupId }): JSX.Element {
	return (
		<NavComponent
			countryGroupIds={[
				GBPCountries,
				UnitedStates,
				AUDCountries,
				EURCountries,
				NZDCountries,
				Canada,
				International,
			]}
			selectedCountryGroup={args.countryGroup}
			subPath={window.location.search}
		/>
	);
}

Nav.args = {
	countryGroup: GBPCountries,
};

Nav.play = async ({ canvasElement }: { canvasElement: HTMLCanvasElement }) => {
	const canvas = within(canvasElement);

	userEvent.click(canvas.getByRole('button'));

	await waitFor(() => {
		expect(canvas.getByRole('dialog')).toHaveAttribute('aria-hidden', 'false');
	});

	await waitFor(() => {
		userEvent.click(canvas.getByTestId('dialog-backdrop'));
	});

	await waitFor(() => {
		expect(canvas.getByTestId('dialog')).not.toBeVisible();
	});
};
