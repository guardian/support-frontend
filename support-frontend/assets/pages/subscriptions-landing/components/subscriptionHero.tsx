import 'helpers/types/option';
import HeroHeader from 'components/hero/HeroHeader';
import type {
	ProductButton,
	ProductCopy,
} from 'pages/subscriptions-landing/copy/subscriptionCopy';
import {
	subscriptionsProductContainer,
	subscriptionsProductContainerFeature,
} from './subscriptionHeroStyles';

export default function SubscriptionHero({
	isFeature = false,
	title,
	description,
	buttons,
	packshotImage = undefined,
	cssOverrides,
}: ProductCopy & { isFeature: boolean }): JSX.Element {
	const button = buttons[0] as ProductButton;
	console.log('*** packshotImage', packshotImage);
	return (
		<div
			css={[
				subscriptionsProductContainer,
				isFeature && subscriptionsProductContainerFeature,
				cssOverrides,
			]}
		>
			{!!packshotImage && (
				<HeroHeader
					heroImage={packshotImage}
					title={title}
					description={description}
					ctaText={button.ctaButtonText}
					ctaLink={button.link}
					onClick={button.analyticsTracking}
					cssOverrides={cssOverrides}
				/>
			)}
		</div>
	);
}
