import type { CheckoutHeadingProps } from 'components/checkoutHeading/checkoutHeading';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { withPositionRelative } from '../../.storybook/decorators/withPositionRelative';

export default {
	title: 'Checkout Layout/Checkout Heading',
	component: CheckoutHeading,
	argTypes: {
		image: {
			table: {
				disable: true,
			},
		},
	},
	decorators: [withPositionRelative],
	parameters: {
		docs: {
			description: {
				component:
					'A heading block that sits behind part of the UI. It must be placed inside a relative positioned container. A subsequent sibling element that is also relatively positioned will automatically sit over it.',
			},
		},
	},
};

function Template(args: CheckoutHeadingProps): JSX.Element {
	return (
		<CheckoutHeading heading={args.heading} image={args.image}>
			{args.children}
		</CheckoutHeading>
	);
}

Template.args = {} as Record<string, unknown>;
Template.parameters = {} as Record<string, unknown>;
Template.decorators = [] as unknown[];

export const Heading = Template.bind({});

Heading.args = {
	heading: 'Thank you for your\u00a0support',
	children: (
		<p>
			Help protect the Guardian&apos;s independence so we can keep delivering
			quality journalism that&apos;s open for everyone around the world, not
			behind a paywall.
		</p>
	),
	image: (
		<img src="/dev_checkout_image.png" alt="The Guardian apps and website" />
	),
};

export const WithSibling = Template.bind({});

WithSibling.args = { ...Heading.args };

WithSibling.decorators = [
	(Story: React.FC) => {
		return (
			<>
				<Story />
				<div
					style={{
						position: 'relative',
						width: '100%',
						display: 'flex',
						justifyContent: 'flex-end',
						padding: '36px',
						paddingTop: '120px',
					}}
				>
					<div
						style={{
							background: '#fff',
							width: '100%',
							maxWidth: '480px',
							height: '600px',
							padding: '12px',
							border: '1px solid black',
						}}
					>
						This is a sibling element that overlays the header
					</div>
				</div>
			</>
		);
	},
];
