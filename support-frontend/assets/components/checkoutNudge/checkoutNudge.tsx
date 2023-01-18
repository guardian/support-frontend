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
import { config } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect, glyph } from 'helpers/internationalisation/currency';
import { CheckoutNudgeCloseButton } from './checkoutNudgeButtonClose';

const styles = {
	container: css`
		border: 1px solid red;
		border-radius: 12px;
		background-color: ${neutral[97]};

		margin-bottom: ${space[3]}px;

		background-size: cover;
		background-repeat: no-repeat;
		background-position: right;
		background-image: url(https://media.guim.co.uk/2d33e52f89462481b77f0fd419d62a55fb70c0f0/0_0_274_202/274.png);
		${from.mobileMedium} {
			background-image: url(https://media.guim.co.uk/91d324df80b882d314dcd35f23dcffea8e346824/0_0_329_188/329.png);
		}
		${from.mobileLandscape} {
			background-image: url(https://media.guim.co.uk/2fcda5a622b598515997c0ce0ff98faffec3826d/0_0_415_188/415.png);
		}
		${from.tablet} {
			margin-top: ${space[2]}px;
			background-image: url(https://media.guim.co.uk/933daaf47129bc1ed1f9af4171d3d5a637fadf2c/0_0_419_213/419.png);
		}
		${from.desktop} {
			background-image: url(https://media.guim.co.uk/29edb4f891687e2188cc44f352372536ee41a04c/0_0_493_190/493.png);
		}
	`,
	top: css`
		border: 1px solid red;
		margin-top: ${space[2]}px;
		margin-bottom: -${space[1]}px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		${from.mobileMedium} {
			margin-bottom: -${space[3]}px;
		}
	`,
	topheading: css`
		border: 1px solid red;
		margin-top: ${space[3]}px;
	`,
	heading: (backColor: string, marginBottom: number) => css`
		border: 1px solid red;
		margin-left: 10px;
		//line-height: 108%;

		color: ${backColor};
		${headline.xxsmall({ fontWeight: 'bold', lineHeight: 'tight' })};

		${from.mobileMedium} {
			margin-left: 12px;
			margin-bottom: ${marginBottom}px;
			${headline.xsmall({ fontWeight: 'bold', lineHeight: 'tight' })};
		}
		${from.tablet} {
			${headline.small({ fontWeight: 'bold', lineHeight: 'tight' })};
		}
	`,

	para: css`
		border: 1px solid red;
		margin-top: ${space[1]}px;
		margin-left: 10px;
		margin-right: 10px;
		margin-bottom: ${space[1]}px;
		//line-height: 130%;
		${textSans.small({ lineHeight: 'regular' })};

		${from.mobileMedium} {
			${textSans.medium({ lineHeight: 'regular' })};
			margin-left: 12px;
			max-width: 350px;
		}
		${from.mobileLandscape} {
			max-width: ;
		}
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	`,
	link: css`
		border: 1px solid red;
		margin-left: 10px;
		//line-height: 135%;
		${textSans.medium({ lineHeight: 'regular' })};
		padding-bottom: ${space[5]}px;

		${from.mobileMedium} {
			margin-left: 12px;
		}
	`,
	alink: css`
  border: 1px solid red;
		color: ${brand[500]};
		text-decoration: underline;
		&:hover {
      fontWeight:'bold';
			cursor: pointer;
		},
	`,
};

export type CheckoutNudge = {
	countryGroupId: CountryGroupId;
};

export type CheckoutNudgeProps = {
	countryGroupId: CountryGroupId;
	nudgeDisplay: boolean;
	nudgeTitleCopySection1: string;
	nudgeTitleCopySection2: string;
	onNudgeClose: () => void;
	onNudgeClick: () => void;
};

export function CheckoutNudge({
	countryGroupId,
	nudgeDisplay,
	nudgeTitleCopySection1,
	nudgeTitleCopySection2,
	onNudgeClose,
	onNudgeClick,
}: CheckoutNudgeProps): JSX.Element {
	const currencyGlyph = glyph(detect(countryGroupId));
	const minAmount = config[countryGroupId]['MONTHLY'].min;
	return (
		<div css={styles.container}>
			{nudgeDisplay && (
				<>
					<div css={styles.top}>
						<div css={styles.topheading}>
							<h2 css={styles.heading(brand[500], space[2])}>
								{nudgeTitleCopySection1}
							</h2>
						</div>
						<CheckoutNudgeCloseButton onClose={onNudgeClose} />
					</div>
					<h2 css={styles.heading(neutral[7], 0)}>{nudgeTitleCopySection2}</h2>
					<p css={styles.para}>
						Regular, reliable support powers Guardian journalism in perpetuity.
						If you can, please consider setting up a monthly payment today from
						just {currencyGlyph}
						{minAmount} – it takes less than a minute.
					</p>
					<div css={styles.link}>
						<a onClick={onNudgeClick} css={styles.alink}>
							See monthly
						</a>
					</div>
				</>
			)}
		</div>
	);
}
