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

const getButtonAppearance = (
	index: number,
	isFeature?: boolean,
	hierarchy?: string,
	primary?: boolean,
) => {
	if (primary ?? (isFeature && index === 0)) {
		return 'primary';
	} else if (isFeature && index > 0) {
		return 'tertiaryFeature';
	} else if (
		(!isFeature && index === 0) ||
		(!isFeature && hierarchy === 'first')
	) {
		return 'secondary';
	}

	return 'tertiary';
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
			<h2 css={[subscriptionTitle, isFeature && subscriptionTitleFeature]}>
				{title}
			</h2>
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
							text: (
								<p>
									{benefit.copyBoldStart && (
										<strong>{benefit.copyBoldStart}</strong>
									)}
									{benefit.copy}
								</p>
							),
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
				{buttons.map((button, index) => (
					<AnchorButton
						href={button.link}
						onClick={button.analyticsTracking}
						appearance={getButtonAppearance(
							index,
							isFeature,
							button.hierarchy,
							button.primary,
						)}
						modifierClasses={[
							button.modifierClasses ?? '',
							'subscriptions__product-button',
						]}
						aria-label={button.ariaLabel ?? null}
					>
						{button.ctaButtonText}
					</AnchorButton>
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
