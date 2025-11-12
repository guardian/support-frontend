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
import type React from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import CountryGroupSwitcherComponent from 'components/countryGroupSwitcher/countryGroupSwitcher';

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

// Test opening and closing the country group switcher
CountryGroupSwitcher.play = async ({
	canvasElement,
}: {
	canvasElement: HTMLCanvasElement;
}) => {
	const canvas = within(canvasElement);

	await userEvent.click(canvas.getByRole('button'));

	await expect(canvas.getByRole('dialog')).toHaveAttribute(
		'aria-hidden',
		'false',
	);

	await waitFor(async () => {
		await userEvent.click(canvas.getByTestId('dialog-backdrop'));
	});

	await waitFor(async () => {
		await expect(canvas.getByTestId('dialog')).not.toBeVisible();
	});
};

export function ExpandedCountryGroupSwitcher(args: {
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

ExpandedCountryGroupSwitcher.args = {
	countryGroup: GBPCountries,
};

// Put the country group switcher into an expanded state before taking the snapshot
ExpandedCountryGroupSwitcher.play = async ({
	canvasElement,
}: {
	canvasElement: HTMLCanvasElement;
}) => {
	const canvas = within(canvasElement);

	await userEvent.click(canvas.getByRole('button'));

	await expect(canvas.getByRole('dialog')).toHaveAttribute(
		'aria-hidden',
		'false',
	);
};
