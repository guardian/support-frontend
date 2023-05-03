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
import type { CSSOverridable } from 'helpers/types/cssOverrideable';
import type { CheckListData } from './checkoutBenefitsListData';

const container = css`
	${textSans.medium({ lineHeight: 'tight' })};
	${until.tablet} {
		tr {
			border-bottom-width: 6px;
		}
	}
`;

const heading = css`
	${headline.xsmall({ fontWeight: 'bold' })}
	${from.tablet} {
		${headline.small({ fontWeight: 'bold', lineHeight: 'tight' })};
	}
	max-width: 250px;
	${from.desktop} {
		max-width: 280px;
	}
`;

const checkListIcon = css`
	vertical-align: top;
	padding-right: 10px;
	line-height: 0;

	svg {
		fill: ${brand[500]};
	}
`;

const iconContainer = css`
	margin-top: -2px;
`;

const checkListText = css`
	display: inline-block;

	& p {
		line-height: 1.35;
	}
`;

const table = (rowSpacing: string) => css`
	padding-top: ${space[4]}px;

	& tr:not(:last-child) {
		border-bottom: ${rowSpacing}px solid transparent;
	}

	${from.mobileLandscape} {
		& tr:not(:last-child) {
			border-bottom: ${space[3]}px solid transparent;
		}
	}
`;

const hr = (margin: string) => css`
	border: none;
	height: 1px;
	background-color: #dcdcdc;
	margin: ${margin};
	${until.tablet} {
		margin: 14px 0;
	}
`;

export interface CheckoutBenefitsListProps extends CSSOverridable {
	title: string;
	checkListData: CheckListData[];
	buttonCopy: string | null;
	handleButtonClick: () => void;
	countryGroupId: CountryGroupId;
}

export function CheckoutBenefitsList({
	title,
	checkListData,
	countryGroupId,
}: CheckoutBenefitsListProps): JSX.Element {
	return (
		<div css={container}>
			<h2 css={heading}>{title}</h2>
			<hr css={hr(`${space[4]}px 0`)} />
			<table css={table(`6`)}>
				{checkListData.map((item) => (
					<tr>
						<td css={[checkListIcon, item.maybeGreyedOut]}>
							<div css={iconContainer}>{item.icon}</div>
						</td>
						<td css={[checkListText, item.maybeGreyedOut]}>{item.text}</td>
					</tr>
				))}
			</table>
			<hr css={hr(`${space[5]}px 0 ${space[4]}px`)} />
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
