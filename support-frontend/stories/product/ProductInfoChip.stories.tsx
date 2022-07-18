import { SvgInfoRound } from '@guardian/source-react-components';
import React from 'react';
import ProductInfoChip from 'components/product/productInfoChip';

export default {
	title: 'Product/Product Info Chip',
	component: ProductInfoChip,
	argTypes: {
		icon: {
			table: {
				disable: true,
			},
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

function Template(args: {
	icon?: React.ReactNode;
	children: React.ReactNode;
}): JSX.Element {
	return <ProductInfoChip icon={args.icon}>{args.children}</ProductInfoChip>;
}

Template.args = {} as Record<string, unknown>;

export const WithIcon = Template.bind({});

WithIcon.args = {
	icon: <SvgInfoRound />,
	children: 'This can give some additional information about a product',
};

export const WithoutIcon = Template.bind({});

WithoutIcon.args = {
	children: 'It can be used with or without an icon',
};
