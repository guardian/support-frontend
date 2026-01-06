import { brandAlt } from '@guardian/source/foundations';
import {
	Button,
	SvgArrowRightStraight,
} from '@guardian/source/react-components';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import type { ProductBenefit } from 'helpers/productCatalog';
import type { ProductButton } from 'pages/subscriptions-landing/copy/subscriptionCopy';
import {
	subscriptionBenefit,
	subscriptionButtonsContainer,
	subscriptionButtonsContainerFeature,
	subscriptionDescription,
	subscriptionOffer,
	subscriptionOfferFeature,
	subscriptionSubtitleLarge,
	subscriptionSubtitleSmall,
	subscriptionTitle,
	subscriptionTitleFeature,
} from './subscriptionsProductDescriptionStyles';

type PropTypes = {
	title: string;
	subtitle: string;
	description: string;
	isFeature?: boolean;
	offer?: string;
	buttons: ProductButton[];
	benefits?: ProductBenefit[];
};

function SubscriptionsProductDescription({
	title,
	subtitle,
	description,
	offer,
	isFeature,
	buttons,
	benefits,
}: PropTypes): JSX.Element {
	return (
		<div>
			<h2
				css={[subscriptionTitle, isFeature && subscriptionTitleFeature]}
				dangerouslySetInnerHTML={{ __html: title }}
			></h2>
			{offer && (
				<h3 css={[subscriptionOffer, isFeature && subscriptionOfferFeature]}>
					{offer}
				</h3>
			)}
			<h3 css={offer ? subscriptionSubtitleSmall : subscriptionSubtitleLarge}>
				{subtitle}
			</h3>
			{benefits ? (
				<BenefitsCheckList
					benefitsCheckListData={benefits.map((benefit) => {
						return {
							text: <p dangerouslySetInnerHTML={{ __html: benefit.copy }} />,
							isChecked: true,
						};
					})}
					benefitsHeading="Subscribe below to unlock the following benefits:"
					iconColor={brandAlt[400]}
					cssOverrides={subscriptionBenefit}
				/>
			) : (
				<p className="subscriptions__description" css={subscriptionDescription}>
					{description}
				</p>
			)}
			<div
				css={[
					subscriptionButtonsContainer,
					isFeature && subscriptionButtonsContainerFeature,
				]}
			>
				{buttons.map((button) => (
					<a href={button.link}>
						<Button
							onClick={button.analyticsTracking}
							aria-label={button.ariaLabel}
							icon={<SvgArrowRightStraight />}
							iconSide="right"
							priority={button.priority}
							theme={button.theme}
						>
							{button.ctaButtonText}
						</Button>
					</a>
				))}
			</div>
		</div>
	);
}

SubscriptionsProductDescription.defaultProps = {
	offer: null,
	buttons: {
		hierarchy: '',
	},
};
export default SubscriptionsProductDescription;
