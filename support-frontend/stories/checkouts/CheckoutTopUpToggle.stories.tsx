import { useState } from 'react';
import type { CheckoutTopUpToggleProps } from 'components/checkoutTopUpToggle/checkoutTopUpToggle';
import { CheckoutTopUpToggle } from 'components/checkoutTopUpToggle/checkoutTopUpToggle';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

export default {
	title: 'Checkouts/TopUp Toggle',
	component: CheckoutTopUpToggle,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					width: '100%',
					maxWidth: '500px',
				}}
			>
				<Story />
			</div>
		),
		withCenterAlignment,
	],
};

function Template(args: CheckoutTopUpToggleProps) {
	const [isSelected, onChange] = useState<boolean>(args.checked);

	return (
		<CheckoutTopUpToggle
			{...args}
			checked={isSelected}
			onChange={() => onChange(!isSelected)}
		/>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	isSelected: true,
	contributionType: 'MONTHLY',
};
