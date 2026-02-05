import type React from 'react';
import type { Product } from 'components/product/productOption';
import ProductOptionComponent from 'components/product/productOption';
import { Channel } from 'pages/paper-subscription-landing/helpers/products';

export default {
	title: 'Product/Product Option',
	component: ProductOptionComponent,
	argTypes: {
		title: { type: 'text' },
		price: { type: 'text' },
		offerCopy: { type: 'text' },
		priceCopy: { type: 'text' },
		buttonCopy: { type: 'text' },
		showLabel: { type: 'boolean' },
		onClick: {
			table: {
				disable: true,
			},
		},
		onView: {
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
					minHeight: '400px',
					display: 'flex',
					alignItems: 'center',
					padding: '16px',
					backgroundColor: '#041F4A',
				}}
			>
				<Story />
			</div>
		),
	],
};

function Template(args: Product) {
	return (
		<ProductOptionComponent
			title={args.title}
			price={args.price}
			offerCopy={args.offerCopy}
			priceCopy={args.priceCopy}
			billingPeriodNoun=""
			buttonCopy={args.buttonCopy}
			showLabel={args.showLabel}
			productLabel={args.productLabel}
			isSpecialOffer={args.isSpecialOffer}
			onClick={() => undefined}
			onView={() => undefined}
			href=""
		/>
	);
}

Template.args = {} as Record<string, unknown>;

export const ProductOption = Template.bind({});

ProductOption.args = {
	title: '6 for 6',
	price: '£6',
	offerCopy: '£6 for the first 6 issues',
	priceCopy: 'then £37.50 per quarter',
	buttonCopy: 'Subscribe now',
	label: 'Best deal',
};

export const SpecialOfferProductOption = Template.bind({});

SpecialOfferProductOption.args = {
	title: '12 for 12',
	price: '£12',
	billingPeriodNoun: 'month',
	offerCopy: '£12 for the first 6 issues',
	priceCopy: 'then £13.50 per month',
	buttonCopy: 'Subscribe now',
	label: 'Special offer',
	isSpecialOffer: true,
};

export const ProductOptionWithProductLabel = Template.bind({});

ProductOptionWithProductLabel.args = {
	title: '6 for 6',
	price: '£6',
	billingPeriodNoun: 'quarter',
	offerCopy: '£6 for the first 6 issues',
	priceCopy: 'then £37.50 per quarter',
	buttonCopy: 'Subscribe now',
	label: 'Best deal',
	productLabel: {
		text: 'The Guardian',
		channel: Channel.Guardian,
	},
};
