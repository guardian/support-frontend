import React from 'react';
import ProductOptionComponent from 'components/product/productOption';

export default {
	title: 'Product/Product Option',
	component: ProductOptionComponent,
	argTypes: {
		title: { type: 'text' },
		price: { type: 'text' },
		offerCopy: { type: 'text' },
		priceCopy: { type: 'text' },
		buttonCopy: { type: 'text' },
		label: { type: 'text' },
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

export function ProductOption(args: {
	title: string;
	price: string;
	offerCopy: string;
	priceCopy: string;
	buttonCopy: string;
	label: string;
}): JSX.Element {
	return (
		<ProductOptionComponent
			title={args.title}
			price={args.price}
			offerCopy={args.offerCopy}
			priceCopy={args.priceCopy}
			buttonCopy={args.buttonCopy}
			label={args.label}
			onClick={() => undefined}
			onView={() => undefined}
			href=""
		/>
	);
}

ProductOption.args = {
	title: '6 for 6',
	price: '£6',
	offerCopy: '£6 for the first 6 issues',
	priceCopy: 'then £37.50 per quarter',
	buttonCopy: 'Subscribe now',
	label: 'Best deal',
};

// stories.add('ProductOptionSmall', () => {
// 	const containerStyles = {
// 		width: '320px',
// 		padding: '20px',
// 		backgroundColor: '#04204B',
// 		color: 'white',
// 		marginRight: '20px',
// 	};
// 	const product1 = {
// 		offerCopy: text('Offer copy - first option', '50% off for 3 months'),
// 		priceCopy: text(
// 			'Price copy - first option',
// 			"You'll pay £5.99/month for 3 months, then £11.99 per month",
// 		),
// 		href: '',
// 		buttonCopy: text(
// 			'Button copy - first option',
// 			'Subscribe monthly for £5.99',
// 		),
// 		onClick: () => {},
// 		onView: () => {},
// 		billingPeriod: 'Monthly',
// 	};
// 	const product2 = {
// 		offerCopy: text(
// 			'Offer copy - second option',
// 			'Save 20% against monthly in the first year',
// 		),
// 		priceCopy: text(
// 			'Price copy - second option',
// 			"You'll pay £99 for 1 year, then £119 per year",
// 		),
// 		href: '',
// 		buttonCopy: text(
// 			'Button copy - second option',
// 			'Subscribe annually for £99',
// 		),
// 		onClick: () => {},
// 		onView: () => {},
// 		billingPeriod: 'Monthly',
// 	};
// 	return (
// 		<div
// 			style={{
// 				display: 'flex',
// 			}}
// 		>
// 			<div style={containerStyles}>
// 				<ProductOptionSmall {...product1} />
// 			</div>

// 			<div
// 				style={{
// 					display: 'flex',
// 					alignItems: 'center',
// 					flexDirection: 'column',
// 					...containerStyles,
// 				}}
// 			>
// 				<ProductOptionSmall {...product1} />
// 				<ProductOptionSmall {...product2} />
// 			</div>
// 		</div>
// 	);
// });
// stories.add('ProductInfoChip', () => (
// 	<div
// 		style={{
// 			width: '100%',
// 			padding: '16px',
// 			backgroundColor: '#04204B',
// 			color: '#ffffff',
// 		}}
// 	>
// 		<ProductInfoChip icon={<SvgInfo />}>
// 			This can give some additional information about a product
// 		</ProductInfoChip>
// 		<ProductInfoChip>It can be used with or without an icon</ProductInfoChip>
// 	</div>
// ));
