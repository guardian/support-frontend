import { css } from '@emotion/react';
import {
	brand,
	from,
	headline,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';
import Tooltip from 'components/tooltip/Tooltip';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CheckListData } from './checkoutBenefitsListData';

const containerCss = css`
	${textSans.medium({ lineHeight: 'tight' })};
	${until.tablet} {
		tr {
			border-bottom-width: 6px;
		}
	}
`;

const headingCss = css`
	${headline.xsmall({ fontWeight: 'bold' })}
	${from.tablet} {
		font-size: 28px;
		line-height: 115%;
	}
	max-width: 250px;
	${from.desktop} {
		max-width: 280px;
	}
`;

const checkListIconCss = css`
	vertical-align: top;
	padding-right: 10px;
	line-height: 0;

	svg {
		fill: ${brand[500]};
	}
`;

const iconContainerCss = css`
	margin-top: -2px;
`;

const checkListTextCss = css`
	display: inline-block;

	& p {
		line-height: 1.35;
	}
`;

const tableCss = css`
	padding-top: ${space[4]}px;

	& tr:not(:last-child) {
		border-bottom: 6px solid transparent;
	}

	${from.mobileLandscape} {
		& tr:not(:last-child) {
			border-bottom: ${space[3]}px solid transparent;
		}
	}
`;

const hrCss = (margin: string) => css`
	border: none;
	height: 1px;
	background-color: #dcdcdc;
	margin: ${margin};
	${until.tablet} {
		margin: 14px 0;
	}
`;

export type CheckoutBenefitsListProps = {
	title: string;
	checkListData: CheckListData[];
	buttonCopy: string | null;
	handleButtonClick: () => void;
	countryGroupId: CountryGroupId;
};

export function CheckoutBenefitsList({
	title,
	checkListData,
	countryGroupId,
}: CheckoutBenefitsListProps): JSX.Element {
	return (
		<div css={containerCss}>
			<h2 css={headingCss}>{title}</h2>
			<hr css={hrCss(`${space[4]}px 0`)} />
			<table css={tableCss}>
				{checkListData.map((item) => (
					<tr>
						<td css={[checkListIconCss, item.maybeGreyedOut]}>
							<div css={iconContainerCss}>{item.icon}</div>
						</td>
						<td css={[checkListTextCss, item.maybeGreyedOut]}>{item.text}</td>
					</tr>
				))}
			</table>
			<hr css={hrCss(`${space[5]}px 0 ${space[4]}px`)} />
			<Tooltip promptText="Cancel anytime">
				<p>
					You can cancel
					{countryGroupId === 'GBPCountries' ? '' : ' online'} anytime before
					your next payment date. If you cancel in the first 14 days, you will
					receive a full refund.
				</p>
			</Tooltip>
		</div>
	);
}
