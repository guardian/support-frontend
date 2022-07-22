import React from 'react';
import ProductOptionSmallComponent from 'components/product/productOptionSmall';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';

export default {
	title: 'Product/Product Option Small',
	component: ProductOptionSmallComponent,
	argTypes: {
		offerCopy: { type: 'text' },
		priceCopy: { type: 'text' },
		buttonCopy: { type: 'text' },
		onClick: {
			table: {
				disable: true,
			},
		},
		billingPeriod: {
			table: {
				disable: true,
			},
		},
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					width: '320px',
					padding: '20px',
					backgroundColor: '#04204B',
					color: 'white',
					marginRight: '20px',
				}}
			>
				<Story />
			</div>
		),
	],
};

function Template(args: {
	offerCopy: string;
	priceCopy: string;
	buttonCopy: string;
	billingPeriod: BillingPeriod;
}): JSX.Element {
	return (
		<ProductOptionSmallComponent
			offerCopy={args.offerCopy}
			priceCopy={args.priceCopy}
			buttonCopy={args.buttonCopy}
			billingPeriod={'Monthly'}
			onClick={() => undefined}
			href=""
		/>
	);
}

Template.args = {} as Record<string, unknown>;

export const ProductOptionSmall = Template.bind({});

ProductOptionSmall.args = {
	offerCopy: '£6 for the first 6 issues',
	priceCopy: 'then £37.50 per quarter',
	buttonCopy: 'Subscribe now',
};
