import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	neutral,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import SvgClose from 'components/svgs/close';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect, glyph } from 'helpers/internationalisation/currency';

const styles = {
	container: css`
		margin-top: ${space[1]}px;
		margin-bottom: ${space[4]}px;
		${textSans.medium({ lineHeight: 'tight' })};
		background-color: ${neutral[97]};
		background-image: url('./backgroundNudgeMobile.png');
		${from.mobileMedium} {
			background-image: url('./backgroundNudgeMobileMedium.png');
		}
		${from.mobileLandscape} {
			background-image: url('./backgroundNudgeMobileLandscape.png');
		}
		${from.tablet} {
			margin-top: ${space[2]}px;
			background-image: url('./backgroundNudgeTablet.png');
		}
		${from.desktop} {
			background-image: url('./backgroundNudgeDesktop.png');
		}
	`,

	heading: (backColor: string) => css`
		margin-left: ${space[3]}px;
		margin-bottom: ${space[1]}px;
		color: ${backColor};
		${headline.xxsmall({ fontWeight: 'bold', lineHeight: 'tight' })};
		max-width: 295px;
		${from.mobileMedium} {
			margin-bottom: ${space[2]}px;
			${headline.xsmall({ fontWeight: 'bold', lineHeight: 'tight' })};
		}
		${from.mobileLandscape} {
			max-width: 350px;
		}
		${from.tablet} {
			${headline.small({ fontWeight: 'bold', lineHeight: 'tight' })};
		}
	`,

	para: css`
		margin-left: ${space[3]}px;
		margin-bottom: ${space[1]}px;
		color: ${neutral[7]};
		max-width: 295px;
		${from.mobileLandscape} {
			max-width: 350px;
		}
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	`,
};

function gotoMonthly() {
	console.log('goto monthly');
}

export type CheckoutNudge = {
	title: string;
	titleColor: string;
	titleSecond: string;
	titleSecondColor: string;
	countryGroupId: CountryGroupId;
};

export const nudgeData: CheckoutNudge = {
	title: 'Make a bigger impact',
	titleColor: neutral[7],
	titleSecond: 'Support us every month',
	titleSecondColor: brand[500],
	countryGroupId: 'GBPCountries',
};

export type CheckoutNudgeProps = {
	checkoutNudge: CheckoutNudge;
	handleCloseButtonClick: () => void;
};

export function CheckoutNudge({
	checkoutNudge,
}: CheckoutNudgeProps): JSX.Element {
	const currencyGlyph = glyph(detect(checkoutNudge.countryGroupId));
	return (
		<div css={styles.container}>
			<SvgClose />
			<h2 css={styles.heading(checkoutNudge.titleColor)}>
				{checkoutNudge.title}
			</h2>
			<h2 css={styles.heading(checkoutNudge.titleSecondColor)}>
				{checkoutNudge.titleSecond}
			</h2>
			<p css={styles.para}>
				Regular, reliable support powers Guardian journalism in perpetuity. If
				you can, please consider setting up a monthly payment today from just{' '}
				{currencyGlyph}2 – it takes less than a minute.
			</p>
			<a css={styles.para} onClick={gotoMonthly}>
				See monthly
			</a>
		</div>
	);
}
