import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import type React from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import SupportRegionSwitcherComponent from '../../assets/components/supportRegionSwitcher/supportRegionSwitcher';

export default {
	title: 'Internationalisation/Country Group Switcher',
	component: SupportRegionSwitcherComponent,
	argTypes: {
		supportRegionId: {
			type: 'select',
			options: ['au', 'ca', 'eu', 'uk', 'int', 'nz', 'us'],
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

export function SupportRegionSwitcher(args: {
	supportRegionId: SupportRegionId;
}): JSX.Element {
	return (
		<SupportRegionSwitcherComponent
			supportRegionIds={['uk', 'us', 'au', 'eu', 'nz', 'ca', 'int']}
			selectedSupportRegion={args.supportRegionId}
			subPath={window.location.search}
		/>
	);
}

SupportRegionSwitcher.args = {
	supportRegionId: 'uk',
};

// Test opening and closing the country group switcher
SupportRegionSwitcher.play = async ({
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

export function ExpandedSupportRegionSwitcher(args: {
	supportRegionId: SupportRegionId;
}): JSX.Element {
	return (
		<SupportRegionSwitcherComponent
			supportRegionIds={['uk', 'us', 'au', 'eu', 'nz', 'ca', 'int']}
			selectedSupportRegion={args.supportRegionId}
			subPath={window.location.search}
		/>
	);
}

ExpandedSupportRegionSwitcher.args = {
	supportRegionId: 'uk',
};

// Put the country group switcher into an expanded state before taking the snapshot
ExpandedSupportRegionSwitcher.play = async ({
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
