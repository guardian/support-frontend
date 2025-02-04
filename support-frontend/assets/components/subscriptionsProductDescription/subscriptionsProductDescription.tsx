import AnchorButton from 'components/button/anchorButton';
import type { ProductBenefit } from 'helpers/productCatalog';
import type { ProductButton } from 'pages/subscriptions-landing/copy/subscriptionCopy';

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
	if (primary) {
		return 'primary';
	}
	if (isFeature && index === 0) {
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
			<h2 className="subscriptions__product-title">{title}</h2>
			{offer && <h3 className="subscriptions__sales">{offer}</h3>}
			{offer && (
				<h3 className="subscriptions__product-subtitle--small">{subtitle}</h3>
			)}
			{!offer && (
				<h3 className="subscriptions__product-subtitle--large">{subtitle}</h3>
			)}
			{benefits ? (
				<SubscriptionsProductBenefits benefits={benefits} />
			) : (
				<p className="subscriptions__description">{description}</p>
			)}
			<div
				className={
					isFeature
						? benefits
							? 'subscriptions__button-container--feature--benefits'
							: 'subscriptions__button-container--feature'
						: 'subscriptions__button-container'
				}
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
					>
						{button.ctaButtonText}
					</AnchorButton>
				))}
			</div>
		</div>
	);
}

function SubscriptionsProductBenefits({
	benefits,
}: {
	benefits: ProductBenefit[];
}): JSX.Element {
	return (
		<ul className="subscriptions__list">
			{benefits.map((benefit) => (
				<li className="subscriptions__listitem">
					<div className="subscriptions__listitem__bullet">{`●`}</div>
					<div>{benefit.copy}</div>
				</li>
			))}
		</ul>
	);
}

SubscriptionsProductDescription.defaultProps = {
	offer: null,
	buttons: {
		hierarchy: '',
	},
};
export default SubscriptionsProductDescription;
