import { expect } from '@storybook/jest';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import React from 'react';
import CountryGroupSwitcherComponent from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';

export default {
	title: 'Internationalisation/Country Group Switcher',
	component: CountryGroupSwitcherComponent,
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
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					width: '100%',
					padding: '16px',
					backgroundColor: '#04204B',
					color: '#ffffff',
				}}
			>
				<Story />
			</div>
		),
	],
};

export function CountryGroupSwitcher(args: {
	countryGroup: CountryGroupId;
}): JSX.Element {
	return (
		<CountryGroupSwitcherComponent
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

CountryGroupSwitcher.args = {
	countryGroup: GBPCountries,
};

CountryGroupSwitcher.play = async ({
	canvasElement,
}: {
	canvasElement: HTMLCanvasElement;
}) => {
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
