import { Column, Columns } from '@guardian/source-react-components';
import type { CheckoutHeadingProps } from 'components/checkoutHeading/checkoutHeading';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { Container } from 'components/layout/container';
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
		<p style={{ marginRight: '48px' }}>
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
					}}
				>
					<Container>
						<Columns>
							<Column width={[0, 0, 1 / 3]}></Column>
							<Column>
								<div
									style={{
										background: '#ffffff',
										width: '100%',
										maxWidth: '540px',
										height: '600px',
										marginTop: '120px',
										padding: '12px',
										border: '1px solid black',
									}}
								>
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
										faucibus nibh erat, eget rutrum ligula vehicula sit amet.
										Etiam scelerisque dapibus pulvinar. Integer non accumsan
										justo. Duis et vehicula risus. Nulla ligula eros, consequat
										sodales lectus eget, eleifend venenatis neque.
									</p>
								</div>
							</Column>
						</Columns>
					</Container>
				</div>
			</>
		);
	},
];
