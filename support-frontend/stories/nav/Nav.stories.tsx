import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import NavComponent from 'components/nav/nav';

export default {
	title: 'Checkout Layout/Nav',
	component: NavComponent,
	argTypes: {
		supportRegionId: {
			type: 'select',
			options: [
				'au',
				'ca',
				'eu',
				'uk',
				'int',
				'nz',
				'us',
			],
		},
	},
	decorators: [(Story: React.FC): JSX.Element => <Story />],
};

export function Nav(args: { supportRegionId: SupportRegionId }): JSX.Element {
	return (
		<NavComponent
			supportRegionIds={[
				'uk',
				'us',
				'au',
				'eu',
				'nz',
				'ca',
				'int',
			]}
			selectedSupportRegion={args.supportRegionId}
			subPath={window.location.search}
		/>
	);
}

Nav.args = {
	supportRegionId: 'uk',
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
