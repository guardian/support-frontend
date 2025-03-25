import { css } from '@emotion/react';
import {
	from,
	neutral,
	palette,
	textEgyptian14,
} from '@guardian/source/foundations';
import AnchorButton from 'components/button/anchorButton';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import type { ProductBenefit } from 'helpers/productCatalog';
import type { ProductButton } from 'pages/subscriptions-landing/copy/subscriptionCopy';

const checkmarkBenefitList = css`
	display: block;
	${textEgyptian14}
	margin: 16px 20px 18px 0;
	line-height: 16px;

	${from.mobileLandscape} {
		margin: 27px 20px 25px 0;
		font-size: 16px;
		line-height: 18px;
	}

	${from.desktop} {
		margin: 45px 20px 25px 0;
		font-size: 20px;
		line-height: 28px;
	}

	:before {
		content: '';
		position: absolute;
		width: 100%;
		border-top: none;
		margin-top: -6px;
		margin-left: -52px;
		${from.tablet} {
			border-top: 1px solid ${neutral[86]};
		}
	}

	> li {
		padding-top: 4px;
		${from.mobileLandscape} {
			padding-top: 6px;
		}
	}
`;

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
			<h2 className="subscriptions__product-title">{title}</h2>
			{offer && <h3 className="subscriptions__sales">{offer}</h3>}
			{offer && (
				<h3 className="subscriptions__product-subtitle--small">{subtitle}</h3>
			)}
			{!offer && (
				<h3 className="subscriptions__product-subtitle--large">{subtitle}</h3>
			)}
			{benefits ? (
				<>
					<BenefitsCheckList
						benefitsCheckListData={benefits.map((benefit) => {
							return {
								text: (
									<p>
										{benefit.copyFirst && <strong>{benefit.copyFirst}</strong>}
										{benefit.copy}
									</p>
								),
								isChecked: true,
							};
						})}
						benefitsHeading="Subscribe below to unlock the following benefits:"
						style={'compact'}
						iconColor={palette.brandAlt[400]}
						cssOverrides={checkmarkBenefitList}
					/>
				</>
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

SubscriptionsProductDescription.defaultProps = {
	offer: null,
	buttons: {
		hierarchy: '',
	},
};
export default SubscriptionsProductDescription;
