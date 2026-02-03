import { brandAlt } from '@guardian/source/foundations';
import AnchorButton from 'components/button/anchorButton';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import type { ProductBenefit } from 'helpers/productCatalog';
import type { ProductButton } from 'pages/subscriptions-landing/copy/subscriptionCopy';
import {
	subscriptionBenefit,
	subscriptionButtonsContainer,
	subscriptionButtonsContainerFeature,
	subscriptionDescription,
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
			<h3 css={offer ? subscriptionSubtitleSmall : subscriptionSubtitleLarge}>
				<span css={subscriptionOfferFeature}>{offer}</span>
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
					<AnchorButton
						onClick={button.analyticsTracking}
						ariaLabel={button.ariaLabel}
						priority={button.priority}
						theme={button.theme}
						link={button.link}
						ctaButtonText={button.ctaButtonText}
					/>
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
