import { css } from '@emotion/react';
import {
	brand,
	headlineBold24,
	neutral,
	space,
} from '@guardian/source/foundations';
import {
	LinkButton,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import type { GeoId} from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';

// TODO: determine what changes between the two different nudges (oneTime to regular and low regular to supporter+)

interface CheckoutNudgeProps {
	type: 'toRegular' | 'toSupporter+';
	geoId: GeoId;
}

const nudgeBoxOverrides = css`
	margin-top: ${space[2]}px;
	background-color: ${neutral[97]};
	& h3 {
		color: ${brand[500]};
		${headlineBold24};
	}
	& p {
		margin-top: ${space[2]}px;
		font-weight: 700;
	}
`;

const nudgeButtonOverrides = css`
	margin-top: ${space[2]}px;
	width: 100%;
`;

const nudgeThankYouBox = css`
	display: flex;
	flex-direction: row;
`;

// TODO: change copy for supporter+ option

const productCatalog = window.guardian.productCatalog;

export function CheckoutNudge({ type, geoId }: CheckoutNudgeProps) {
	const { currency, currencyKey: currencyId } = getGeoIdConfig(geoId);

	const lowMonthlyRecurringAmount = productCatalog.Contribution?.ratePlans
		.Monthly?.pricing[currencyId] as number;

	const getButtonCopy =
		type === 'toRegular'
			? `Support us for ${currency.glyph}${lowMonthlyRecurringAmount}/month`
			: `Support us for ${currency.glyph}4/month`;

	const tier1UrlParams = new URLSearchParams({
		product: 'Contribution',
		ratePlan: 'Monthly',
		contribution: lowMonthlyRecurringAmount.toString(),
		// todo: add ab: checkoutOneTimeNudge and pick up in generic checkout.
	});
	const buildCtaUrl = `checkout?${tier1UrlParams.toString()}`;

	const getNudgeHeadline =
		type === 'toRegular' ? 'Make a bigger impact' : 'Make a bigger impact';

	const getNudgeCopy =
		type === 'toRegular'
			? 'Regular, reliable support powers Guardian journalism in perpetuity. It takes less than a minute.'
			: 'Regular, reliable support powers Guardian journalism in perpetuity. It takes less than a minute.';

	return (
		<Box cssOverrides={nudgeBoxOverrides}>
			<BoxContents>
				<h3>{getNudgeHeadline}</h3>
				<p>{getNudgeCopy}</p>
				<LinkButton
					id="id_checkoutNudge"
					cssOverrides={nudgeButtonOverrides}
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

// probably need to pass the type to ensure we're showing the correct values.
export function CheckoutNudgeThankYou() {
	return (
		<Box cssOverrides={nudgeBoxOverrides}>
			<BoxContents>
				<div css={nudgeThankYouBox}>
					<div>
						<h3>Thank you for choosing to Support us monthly</h3>
						<p>You are helping ensure the future of Guardian journalism.</p>
					</div>
					{/* TODO: define width, src of image */}
					<img />
				</div>
			</BoxContents>
		</Box>
	);
}
