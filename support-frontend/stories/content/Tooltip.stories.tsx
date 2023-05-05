import type { TooltipProps } from 'components/tooltip/Tooltip';
import TooltipComponent from 'components/tooltip/Tooltip';

export default {
	title: 'Content/Tooltip',
	component: TooltipComponent,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					width: 'max-content',
				}}
			>
				<Story />
			</div>
		),
	],
};

function Template(args: TooltipProps): JSX.Element {
	return <TooltipComponent {...args} />;
}

Template.args = {} as TooltipProps;

export const Tooltip = Template.bind({});

Tooltip.args = {
	promptText: 'Cancel anytime',
	children: (
		<p>
			You can cancel anytime before your next payment date. If you cancel in the
			first 14 days, you will receive a full refund.
		</p>
	),
};
