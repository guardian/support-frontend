import GridImage from 'components/gridImage/gridImage';
import OrderSummaryComponent from 'components/orderSummary/orderSummary';
import OrderSummaryProduct from 'components/orderSummary/orderSummaryProduct';

export default {
	title: 'Checkouts/Order Summary',
	component: OrderSummaryComponent,
};

export function OrderSummary(): JSX.Element {
	const productInfoPaper = [
		{
			content: "You'll pay £57.99/month",
		},
		{
			content: 'Your first payment will be on 04 February 2021',
			subText:
				'Your subscription card will arrive in the post before the payment date',
		},
	];
	const productInfoDigiSub = [
		{
			content: "You'll pay £5/month",
		},
	];
	const mobileSummary = {
		title: 'Sixday paper + Digital',
		price: "You'll pay £62.99/month",
	};
	return (
		<div
			style={{
				maxWidth: '470px',
				border: '1px solid #DCDCDC',
			}}
		>
			<OrderSummaryComponent
				image={
					<GridImage
						gridId="printCampaignHDdigitalVoucher"
						srcSizes={[500]}
						sizes="(max-width: 740px) 50vw, 696"
						imgType="png"
						altText=""
					/>
				}
				changeSubscription="/"
				total="£62.99/month"
				mobileSummary={mobileSummary}
			>
				<OrderSummaryProduct
					productName="Sixday paper"
					productInfo={productInfoPaper}
				/>
				<OrderSummaryProduct
					productName="Digital subscription"
					productInfo={productInfoDigiSub}
				/>
			</OrderSummaryComponent>
		</div>
	);
}
