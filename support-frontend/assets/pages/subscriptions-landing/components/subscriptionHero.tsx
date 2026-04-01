import 'helpers/types/option';
import { SvgArrowRightStraight } from '@guardian/source/react-components';
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
	subtitle,
	packshotImage = undefined,
	cssOverrides,
}: ProductCopy & { isFeature: boolean }): JSX.Element {
	const button = buttons[0] as ProductButton;
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
					subTitle={subtitle}
					ctaText={button.ctaButtonText}
					ctaLink={button.link}
					onClick={button.analyticsTracking}
					ctaIcon={<SvgArrowRightStraight />}
				/>
			)}
		</div>
	);
}
