import { css } from '@emotion/react';
import { brand, neutral } from '@guardian/source-foundations';
import { Column, Columns } from '@guardian/source-react-components';
import type { BoxProps } from 'components/checkoutBox/checkoutBox';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { Container } from 'components/layout/container';

export default {
	title: 'Checkout Layout/Box',
	component: Box,
	subcomponents: { BoxContents },
	argTypes: {
		tag: {
			control: { type: 'select', options: ['div', 'section', 'fieldset'] },
		},
	},
	parameters: {
		docs: {
			description: {
				component:
					'A container box for sections of the checkout form. The BoxContents component can be used to provide uniform padding to content inside a Box.',
			},
		},
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Container backgroundColor="#D9D9D9">
				<Columns
					collapseUntil="tablet"
					cssOverrides={css`
						justify-content: center;
						padding: 1rem 0;
					`}
				>
					<Column width={[1, 3 / 4, 1 / 2]}>
						<Story />
					</Column>
				</Columns>
			</Container>
		),
	],
};

function Template(args: BoxProps): JSX.Element {
	return <Box {...args} />;
}

Template.args = {} as Record<string, unknown>;

export const WithBoxContents = Template.bind({});

WithBoxContents.args = {
	children: (
		<BoxContents>
			This is simple container for content on the checkout page.
		</BoxContents>
	),
	tag: 'section',
};

export const WithoutBoxContents = Template.bind({});

WithoutBoxContents.args = {
	children: (
		<div>
			<h2
				style={{
					backgroundColor: brand[600],
					color: neutral[100],
					height: '42px',
					padding: '8px',
				}}
			>
				Heading
			</h2>
			<BoxContents>
				Elements not wrapped in a BoxContents will take up the full width of the
				Box, but not overflow it.
			</BoxContents>
		</div>
	),
};
