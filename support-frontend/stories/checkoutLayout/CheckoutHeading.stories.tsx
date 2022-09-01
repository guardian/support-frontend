import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	neutral,
	space,
	until,
} from '@guardian/source-foundations';
import { Column, Columns } from '@guardian/source-react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
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
	heading: (
		<h1
			css={css`
				color: ${neutral[100]};
				display: inline-block;
				${headline.medium({ fontWeight: 'bold' })}
				font-size: 36px;
				${from.tablet} {
					font-size: 38px;
				}

				${until.desktop} {
					margin: 0 auto;
					margin-bottom: ${space[6]}px;
				}
				${from.desktop} {
					${headline.large({ fontWeight: 'bold' })}
					margin-bottom: ${space[3]}px;
				}
			`}
		>
			Thank you for&nbsp;your&nbsp;support
		</h1>
	),
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

export const WithMenu = Template.bind({});

WithMenu.args = { ...Heading.args };

WithMenu.decorators = [
	(Story: React.FC): JSX.Element => (
		<div
			style={{
				backgroundColor: brand[400],
				paddingTop: '1rem',
			}}
		>
			<Container
				topBorder={true}
				sideBorders={true}
				borderColor={brand[600]}
				backgroundColor={brand[400]}
			>
				<div style={{ color: 'white', paddingTop: '1rem' }}>
					[Menu component]
				</div>
			</Container>
			<Story />
		</div>
	),
];

export const WithSiblingOverlaid = Template.bind({});

WithSiblingOverlaid.args = { ...Heading.args };

WithSiblingOverlaid.decorators = [
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
						<Columns
							cssOverrides={css`
								padding-top: 120px;
							`}
						>
							<Column width={[0, 1 / 8, 1 / 3]}></Column>
							<Column width={[1, 3 / 4, 1 / 2]}>
								<Box>
									<BoxContents>
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit.
											Ut faucibus nibh erat, eget rutrum ligula vehicula sit
											amet. Etiam scelerisque dapibus pulvinar. Integer non
											accumsan justo. Duis et vehicula risus. Nulla ligula eros,
											consequat sodales lectus eget, eleifend venenatis neque.
										</p>
									</BoxContents>
								</Box>
							</Column>
						</Columns>
					</Container>
				</div>
			</>
		);
	},
];
