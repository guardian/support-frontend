import { css } from '@emotion/react';
import {
	headlineBold24,
	neutral,
	palette,
	space,
} from '@guardian/source/foundations';
import {
	LinkButton,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { ProductBenefit } from 'helpers/globalsAndSwitches/landingPageSettings';
import { type ActiveRatePlanKey, productCatalog } from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';

// TODO: determine what changes between the two different nudges (oneTime to regular and low regular to supporter+)

type NudgeType = 'toRegular' | 'toSupporterPlus';

interface CheckoutNudgeProps {
	type: NudgeType;
	geoId: GeoId;
	ratePlanKey: ActiveRatePlanKey;
}

interface CheckoutNudgeThanksProps {
	type: NudgeType;
}

const nudgeBoxOverrides = css`
	margin-top: ${space[2]}px;
	background-color: ${neutral[97]};
	& h3 {
		color: ${palette.brand[500]};
		${headlineBold24};
	}
	& p {
		margin-top: ${space[2]}px;
		font-weight: 700;
	}
`;

const boxContentsOverrides = css`
	display: grid;
	/*grid-template-cols: 1fr;
	grid-template-rows:  auto auto auto; */
`;

const headlineOverrides = css`
	order: 1;
`;

const bodyCopyOverrides = css`
	order: 4;
`;

const checkmarkBenefitList = css`
	text-align: left;
	margin-top: 12px;
`;

const nudgeButtonOverrides = (isSupporterPlus: boolean) => css`
	margin-top: ${space[2]}px;
	width: 100%;
	${isSupporterPlus ? 'order:3' : 'order:6'};
`;

const nudgeThankYouBox = css`
	display: flex;
	flex-direction: row;
`;

// TODO: add tracking e.g., line 195 in checkoutSummary

export function CheckoutNudge({
	type,
	geoId,
	ratePlanKey,
}: CheckoutNudgeProps) {
	const { currency, currencyKey: currencyId } = getGeoIdConfig(geoId);

	if (!['Monthly', 'Annual'].includes(ratePlanKey)) {
		ratePlanKey = 'Monthly';
	}

	const isSupporterPlus = type === 'toSupporterPlus';

	const lowMonthlyRecurringAmount = productCatalog.Contribution?.ratePlans[
		ratePlanKey
	]?.pricing[currencyId] as number;

	const supporterPlusAmount = productCatalog.SupporterPlus?.ratePlans[
		ratePlanKey
	]?.pricing[currencyId] as number;

	const ratePlanDescription = ratePlanKey === 'Monthly' ? 'month' : 'year';

	const getButtonCopy =
		type === 'toRegular'
			? `Support us for ${
					currency.glyph
			  }${lowMonthlyRecurringAmount.toString()}/${ratePlanDescription}`
			: `Support us for ${
					currency.glyph
			  }${supporterPlusAmount.toString()}/${ratePlanDescription}`;

	const tier1UrlParams = new URLSearchParams({
		product: 'Contribution',
		ratePlan: ratePlanKey,
		contribution: lowMonthlyRecurringAmount.toString(),
		nudge: 'toRegular',
	});

	const tier2UrlParams = new URLSearchParams({
		product: 'SupporterPlus',
		ratePlan: ratePlanKey,
		nudge: 'toSupporterPlus',
	});

	// TODO: remove the force variant before go live!!!
	const buildCtaUrl =
		type === 'toRegular'
			? `checkout?${tier1UrlParams.toString()}#ab-abNudgeToLowRegular=variant`
			: `checkout?${tier2UrlParams.toString()}#ab-abNudgeToSupporterPlus=variant`;

	const getNudgeHeadline =
		type === 'toRegular' ? 'Make a bigger impact' : 'Make a bigger impact';

	const getNudgeCopy =
		type === 'toRegular'
			? 'Regular, reliable support powers Guardian journalism in perpetuity. It takes less than a minute.'
			: 'Your all access benefits';

	const benefits: ProductBenefit[] = [
		{
			copy: 'Unlimited access to the premium Guardian app',
			label: {
				copy: 'Refreshed',
			},
		},
		{
			copy: 'Exclusive newsletter sent every week from the Guardian newsroom',
		},
		{
			copy: 'Unlimited access to the Guardian Feast app',
		},
		{
			copy: 'Ad-free reading on all your devies',
		},
	];

	return (
		<Box cssOverrides={nudgeBoxOverrides}>
			<BoxContents cssOverrides={boxContentsOverrides}>
				<h3 css={headlineOverrides}>{getNudgeHeadline}</h3>
				<div css={bodyCopyOverrides}>
					<p>{getNudgeCopy}</p>
					{isSupporterPlus && (
						<BenefitsCheckList
							benefitsCheckListData={benefits.map((benefit) => {
								return {
									text: benefit.copy,
									isChecked: true,
									toolTip: benefit.tooltip,
									pill: benefit.label?.copy,
									hideBullet: benefits.length <= 1,
								};
							})}
							style={'compact'}
							iconColor={palette.brand[500]}
							cssOverrides={checkmarkBenefitList}
						/>
					)}
				</div>
				<LinkButton
					id="id_checkoutNudge"
					cssOverrides={nudgeButtonOverrides(isSupporterPlus)}
					isLoading={false}
					theme={themeButtonReaderRevenueBrand}
					href={buildCtaUrl}
				>
					{getButtonCopy}
				</LinkButton>
			</BoxContents>
		</Box>
	);
}

export function CheckoutNudgeThankYou({ type }: CheckoutNudgeThanksProps) {
	const getNudgeHeadline =
		type === 'toRegular'
			? 'Thank you for choosing to Support us monthly'
			: 'Thank you for choosing to upgrade';

	const getNudgeCopy =
		type === 'toRegular'
			? 'You are helping ensure the future of Guardian journalism.'
			: 'Alongside your extra benefits you are also helping ensure the future of The Guardian.';

	return (
		<Box cssOverrides={nudgeBoxOverrides}>
			<BoxContents>
				<div css={nudgeThankYouBox}>
					<div>
						<h3>{getNudgeHeadline}</h3>
						<p>{getNudgeCopy}</p>
					</div>
					<img width='116px' src='https://uploads.guim.co.uk/2025/08/28/313aafcd2a1b8fed178628ce346b517248d8692b.png' />
				</div>
			</BoxContents>
		</Box>
	);
}
